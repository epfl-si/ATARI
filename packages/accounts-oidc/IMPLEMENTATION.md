# Implementation Notes

## Goals and Non-Goals

`epfl:accounts-oidc` aims for

- compatibility with all OIDC-compatible IdPs, including (but not limited to) the ones it actually gets tested against on the regular 😜:
  <ul>
   <li> Entra: because this is what we have at EPFL;</li>
   <li> Keycloak: for disconnected testing in development.</li>
  </ul>
  However, interoperability problems with other IdPs are considered as bugs; please raise issues and (if you feel so inclined) provide pull requests.
- **partial** (although faithful) implementation of the [OIDC specification](https://openid.net/specs/openid-connect-core-1_0.html) for those use-cases that are relevant to Meteor (as stated under §§ “Features” and “Non-features” in [README.md](./README.md))

## Modern Package

This Atmosphere package does

- TypeScript, thanks to `api.use("typescript")`
- provide (isometric) TypeScript types, the [`zodern:meteor-types`](https://github.com/zodern/meteor-types) way
- use all the bells and whistles of modern JavaScript; first and foremost `async` / `await`
- build on top of `accounts-oauth` and `oauth2`, in exactly the same way that [OpenID-Connect is compatible with OAuth2](https://openid.net/developers/how-connect-works/).

This Atmosphere package **does not**

- support Meteor versions prior to 3.x
- pollute the global namespace or the `Packages` array; it must be consumed the modern way, i.e.
  ```typescript

  import { OIDC } from "meteor/epfl:accounts-oidc"
  ```
- support backwards-compatible terminology or fields from the OAuth era, such as `requestPermissions` as a synonym for `scope`
- split itself arbitrarily into several Atmosphere packages for reasons shrouded in the mists of time
- expect callbacks as the last parameter to its entry points, like it is stuck in 2011; inasmuch as possible, said entry points are `Promise`-returning functions instead.

## Decisions Driven by the Meteor Ecosystem

### Deep dive into the Meteor OAuth implementation, or: why isn't the redirection URI configurable

The `meteor/oauth` package is opinionated on exactly how the OAuth protocol (both version 1, which is off-topic here, and version 2), a REST-based Web API, ought to integrate with Meteor's perennial [DDP](https://blog.meteor.com/introducing-ddp-6b40c6aff27d) protocol; and how to navigate the inherent hazards of OAuth 2 — most notably, the fact that your browser will forget (almost) everything about Meteor as it navigates away to the IdP to let you type in your password.

As far as OpenID-Connect (meaning OAuth 2) is concerned, Meteor offers two main so-called **login styles** as seen in in [README.md](./README.md). The OAuth 2 dance goes like this:

1. (Unless `loginStyle === "popup"`) In preparation of forgetting everything when the browser will navigate to the IdP in the next step, the Meteor client makes a note to itself of the state that matters (most notably, the value of `loginStyle`) using a combination of [`window.sessionStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage) and a JSON-serialized datum passed through the `state` [standard query parameter](https://openid.net/specs/openid-connect-core-1_0.html#AuthRequest) to the IdP (that will pass it back later)
2. The Meteor client tells the browser to navigate to the IdP using the `window.location` API (if `loginStyle === "rediret"`), or opens a pop-up window to same (if `loginStyle === "popup"`)
3. The IdP and the browser do their thing together, which can be very short (e.g. present session cookie, done), or longish (e.g. two-factor authentication, ask user to consent, and/or select which personal information is going to be disclosed to Meteor etc.)
4. Once the IdP is satisfied with all that, it redirects the browser back to `$ROOT_URL/_oauth/oidc` (and nothing else; see next step to find out why), passing back the same `?state=` query parameter that the client prepared on step 1, as well as other query parameters — most notably, `?code=` which is key for the remainder of the authentication process.
5. The Meteor server (specifically, the `meteor/oauth` package) provides a plain old `express` [middleware](https://github.com/search?q=repo%3Ameteor%2Fmeteor+%22middleware%22+path%3Apackages%2Foauth&type=code) that answers HTTP GET queries at `$ROOT_URL/_oauth/oidc` only — That URL is *not* configurable. That middleware
   - decodes `loginStyle` from the `state=` parameter;
   - forwards the `code=` parameter to the IdP's [Token Request](https://openid.net/specs/openid-connect-core-1_0.html#TokenRequest) endpoint;
   - stores the IdP response in the so-called [pending credentials](https://github.com/meteor/meteor/blob/devel/packages/oauth/pending_credentials.js) Mongo collection;
   - cooks up a `(credentialToken, credentialSecret)` pair, forming a Meteor-proprietary [HMAC](https://en.wikipedia.org/wiki/HMAC) scheme in which `credentialToken` is a random nonce, acting as the key in the Mongo collection, and `credentialSecret` is the signature;
   - and finally, depending on `loginStyle`, serves one or the other piece of templated HTML (which itself calls out to one or the other static JavaScript asset), to cause the browser to prepare for the next step:

      | `loginStyle` value | Assets | Effect |
      | ------------------ | ----------------------- | ------ |
      | `"popup"` (or missing) | [`/packages/oauth/end_of_popup_response.html`](https://github.com/meteor/meteor/blob/master/packages/oauth/end_of_popup_response.html) <br/> [`/packages/oauth/end_of_popup_response.js`](https://github.com/meteor/meteor/blob/master/packages/oauth/end_of_popup_response.js) | Passes the credentials to the main window by [hook](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) or by [crook](https://developer.mozilla.org/en-US/docs/Web/API/Window/opener) |
      | `"redirect"` | [`/packages/oauth/end_of_redirect_response.html`](https://github.com/meteor/meteor/blob/master/packages/oauth/end_of_redirect_response.html) <br/> [`/packages/oauth/end_of_redirect_response.js`](https://github.com/meteor/meteor/blob/master/packages/oauth/end_of_redirect_response.js) | Saves the credentials into `window.sessionStorage` again (encapsulating it as a “Meteor migration” per the [`meteor/reload` package](https://github.com/meteor/meteor/blob/master/packages/reload/README.md)), and redirects the browser to the main app|

6. The Meteor client receives the `(credentialToken, credentialSecret)` pair one way or the other, as per the table above (i.e. from a window-to-window communication, respectively, from a `meteor/reload`-style “migration” in [`OAuth.getDataAfterRedirect`](https://github.com/search?q=repo%3Ameteor%2Fmeteor%20OAuth.getDataAfterRedirect&type=code)), and issues a DDP method call to the `login` method, passing a nested dict with main key `oauth`, and sub-keys `credentialToken` and `credentialSecret`, as the method parameter
7. The Meteor server validates the HMAC signature, looks up the remainder of the data from the pending credentials store, (deletes it from there,) and completes the login process [as per the normal `meteor/accounts` procedure](https://docs.meteor.com/api/accounts) — to wit:
   <ul>
     <li>it writes the details of the user that just logged in in the `Meteor.users` Mongo collection (through the [`Accounts.updateOrCreateUserFromExternalService` function](https://github.com/search?q=repo%3Ameteor%2Fmeteor+symbol%3AupdateOrCreateUserFromExternalService&type=code)),</li>
     <li>it marks the current DDP session as [belonging to](https://guide.meteor.com/accounts#userid-ddp) the user that just logged in,</li>
     <li>... which (combined with the update to `Meteor.users`, above) causes `Meteor.user()` etc. to promptly update over DDP,</li>
     <li>and it finally causes the `Meteor.login` DDP call to succeed.
   </ul>

Security rests on the guarantee that step 7 *must not* be allowed to happen if an attacker presents a forged (`oauth.credentialToken`, `oauth.credentialSecret`) pair as part of a `login` Meteor DDP call — which anyone with network access to the Meteor server can attempt. Steps 5 and 7 provide that guarantee by ensuring that that pair is

- **unguessable**, per the randomness of the `credentialToken`,
- **unforgeable**, per the HMAC signature,
- and **a proof** of a prior, successful REST call to the IdP's Token Request entry point (because the `credentialToken` must exist in Mongo).

In conclusion:

- The good: **security is a core feature** of the Meteor OAuth framework — not removeable, not to be provided by IdP-specific implementations such as this here package — and it has been that way across decades, and protocol major versions, and `loginStyle`s. **If it works, you can trust it.**
- The ugly: near as I can tell, **almost none of that stuff is documented anywhere**; it was all figured out through reverse-engineering.

### Calls and Callbacks

Both client- and server-side code in `epfl:accounts-oidc` mesh with the polymorphic implementation of Meteor's accounts and OAuth subsystems, by calling the relevant (albeit often poorly documented, if at all) registration and action functions. Details (sometimes) appear next to the call sites in the source code.

Note that a bunch of these APIs are both indispensable *and* private, and there is not much we can do about that, save for closely managing the “permission” to call them from our own code by means of a few TypeScript pro-gamer moves.

Also note that these same APIs use callbacks a lot for continuation passing, like they are stuck in 2011, (which they kind of are.) As seen in § “Modern Package” above, we hoist that to `async` style in our callers wherever (and as soon as) possible.

### `meteor.loginServiceConfiguration` vs. the OIDC client secret

It is [well-known](https://docs.meteor.com/api/accounts#service-configuration) that whatever one puts in the [Meteor settings](https://docs.meteor.com/api/meteor.html#Meteor-settings) under `packages["service-configuration"]` gets upserted into the `meteor_accounts_loginServiceConfiguration` Mongo collection, which is auto-published (regardless of whether the `autopublish` package is in play — which it shouldn't, once once your application is headed for production).

What is less well-known, however, is that [the `meteor.loginServiceConfiguration` publication omits the `secret` top-level key](https://github.com/search?q=repo%3Ameteor%2Fmeteor%20%22Publish%20all%20login%20service%20configuration%20fields%20other%20than%20secret%22&type=code). Placing the OpenID-Connect client secret as `.secret.clientSecret`, rather than the top level of the service configuration, thus results in it being concealed from the Meteor client as it should.

# References

- https://docs.meteor.com/api/accounts
- A whole bucketful o' RTFS at https://github.com/meteor/meteor
