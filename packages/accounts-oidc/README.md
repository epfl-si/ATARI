# `epfl:accounts-oidc` Atmosphere package

Plug of the popular OpenID-Connect (OIDC) identity providers (IdP) into your Meteor application to authenticate users.

## Features

- Fully compatible with the [Meteor accounts API](https://docs.meteor.com/api/accounts)
- Supports *only* the OIDC “Authorization Code Flow”, in both [“popup” and “redirect” flavors](https://docs.meteor.com/api/accounts#popup-vs-redirect-flow)¹

¹ It is a bit unfortunate that the Meteor terminology sometimes uses “popup flow” and “redirect flow”, while they are one and the same flow in the OpenID-Connect sense 🤷‍♂️ In this documentation, we use “login style” instead.

## Non-features

`epfl:accounts-oidc` assumes that the *server*, not the browser, will be [querying](https://openid.net/specs/openid-connect-core-1_0.html#TokenRequest) the IdP to redeem the token at the end of a successful authentication. That is, you should *not* set “single-page Web app” mode in Entra, in spite of what you believe you know about Meteor and single-page Web apps. This is *not* the same approach as say, [`@epfl-si/react-appauth`](https://www.npmjs.com/package/@epfl-si/react-appauth).

# Install

`meteor add epfl:accounts-oidc`

# Configure the Identity Provider

The goal of this step is to obtain the **client ID**, **client secret** and **OIDC base URL** for use below. Consult the documentation of your IdP to find out how to do that.

The OIDC base URL is the one that returns JSON when you paste it into your browser's URL bar, append `/.well-known/openid-configuration` at the end of it, and press Enter. If your IdP doesn't provide such an auto-configuration JSON document, you will have to use advanced configuration (documented below) to provide each OAuth 2 entry point by hand.

For security reasons, many OIDC-compliant IdPs, including Keycloak and Entra, want to know in advance (i.e. whitelist) which URLs the user's browser can be redirected to after logging in. *Meteor doesn't let you pick the URL here*; as [documented](https://guide.meteor.com/accounts#oauth-configuration), you need to use `$ROOT_URL/_oauth/oidc` where `$ROOT_URL` is the root URL of the Web app.

## Configure the Meteor app

Do *one* of the following:

- in  your `settings.json`:

   ```javascript
   { // ...
     "packages": {
       "service-configuration": {
         "oidc": {
           "loginStyle": "redirect",
           "baseUrl": "login.microsoftonline.com/aaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeeeeee/",
           "clientId": "CLIENT-ID",
           "secret": { "clientSecret": "CLIENT-SECRET" }
         }
       }
     }
   }
   ```
- **OR** <br/> in some file under `server/`:

   ```typescript
   import { Meteor } from "meteor/meteor"
   import { ServiceConfiguration } from "meteor/service-configuration"

   Meteor.startup(async () => {
     await ServiceConfiguration.configurations.upsertAsync(
       { service: "oidc" },
       {
         $set: {
           loginStyle: "redirect",
           "baseUrl": "https://login.microsoftonline.com/aaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeeeeee/",
           "clientId": "CLIENT-ID",
           "clientSecret": "CLIENT-SECRET"
         },
       }
     );
   });
   ```

## Use in your app

```typescript
import React from "react"
import { Meteor } from "meteor/meteor"
import { useTracker } from 'meteor/react-meteor-data'
import { OIDC } from "meteor/epfl:accounts-oidc"

function LoginLogoutClicky () {
    const isLoggedIn = useTracker(() => !! Meteor.userId());

    return <>
      { isLoggedIn ?
          <a href="#" onClick={() => Meteor.logout()}>Logout</a> :
          <a href="#" onClick={() => OIDC.login()}>Login</a> }
    </>;
}
```

# Configuration Reference

| Option name          | Purpose                                                                                                                                                                                | Example value(s)                                                                                 | Default                                                                                                   |
|----------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------|
| `loginStyle`         | Choose the UX for the login operation in the browser                                                                                                                                   | `"popup"` or `"redirect"`                                                                        | `"popup"`                                                                                              |
| `scope`              | A list of strings (with IdP-specific meaning) stipulating which personal information to retrieve at login time                                                                         | `"openid email"` or `["openid", "email"]`                                                        | `"openid"`                                                                                                |
| `loginUrlParameters` | IdP-specific additional query parameters to pass along with the initial browser redirect to the IdP                                                                                    | `{"foo": "bar"}`                                                                                 | `{}`                                                                                                      |
| `baseUrl`        | The base URL to resolve OpenID-Connect endpoints from                                                                                                                                  | `https://login.microsoftonline.com/aaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeeeeee/v2.0`                  | N/A                                                                                                       |
| `tokenEndpoint`      | The URL of the [OIDC Token Endpoint](https://openid.net/specs/openid-connect-core-1_0.html#TokenEndpoint)                                                                              | `https://login.microsoftonline.com/aaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeeeeee/oauth2/v2.0/token`     | `token_endpoint` JSON response field at URL: `baseUrl + "/.well-known/openid-configuration"`          |
| `authorizeEndpoint`  | The URL of the [Authorization Endpoint](https://openid.net/specs/openid-connect-core-1_0.html#AuthorizationEndpoint) (the one that the server calls to finish the OAuth login process) | `https://login.microsoftonline.com/aaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeeeeee/oauth2/v2.0/user_info` | `authorization_endpoint` JSON response field  at URL: `baseUrl + "/.well-known/openid-configuration"` |
| `userinfoEndpoint`   | The URL of the [UserInfo Endpoint](https://openid.net/specs/openid-connect-core-1_0.html#UserInfo) (the one that returns the signed JWT token)                                         | `https://login.microsoftonline.com/aaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeeeeee/oauth2/v2.0/user_info` | `userinfo_endpoint` JSON response field at URL: `baseUrl + "/.well-known/openid-configuration"`       |
