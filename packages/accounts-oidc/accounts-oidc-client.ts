import { Accounts } from "meteor/accounts-base"
import { OAuth } from "meteor/oauth"
import { getConfiguration, getLoginStyle } from "./config"
import { getAuthorizationEndpoint, getMeteorUri, getRedirectionUri } from "./uris"
import { Random } from "meteor/random"

import { OIDC, OIDCConfiguration, LoginStyleString } from "./index"

// Sole public API for this module. Returns immediately.
OIDC.login = (...args) => Accounts.applyLoginFunction('oidc', args);

// Tell Accounts.applyLoginFunction (above) to call us back later:
Accounts.registerClientLoginFunction('oidc', loginWithOpenIDConnect);

async function loginWithOpenIDConnect (options : Partial<OIDCConfiguration> = {}) : Promise<void> {
  const config = await getConfiguration();

  const credentialToken = Random.secret();

  let scope = options.scope || ['openid'];
  if (scope instanceof Array) scope = scope.join(' ');

  const loginStyle = await getLoginStyle(options),
        redirectUri = getRedirectionUri();

  const loginUrl = new URL(await getAuthorizationEndpoint());

  type OAuthPrivate = typeof OAuth & {
    // https://github.com/meteor/meteor/blob/master/packages/oauth/oauth_client.js
    _stateParam (
      loginStyle: LoginStyleString,
      credentialToken: string,
      redirectUrl: string
    ): string;
  }

  const loginUrlParameters = {
    ...(options.loginUrlParameters || {}),
    response_type: "code",
    client_id:  config.clientId,
    scope,
    redirect_uri: redirectUri,
    state: (OAuth as OAuthPrivate)._stateParam(loginStyle, credentialToken,
      // In this context, `redirectUrl` means the URL of the *final*
      // redirect as in `loginStyle === "redirect"`, consumed by the
      // last step of /packages/oauth/end_of_redirect_response.js (and
      // unused when `loginStyle === "popup"`):
      getMeteorUri())
  };

  Object.entries(loginUrlParameters).forEach(([key, value] : [string, string]) => {
    if (value) {
      if (['redirect_uri', 'scope', 'state'].includes(key)) {
        loginUrl.searchParams.append(key, value);
      } else {
        loginUrl.searchParams.append(encodeURIComponent(key), encodeURIComponent(value));
      }
    }
  });

  const token = await new Promise<string>((resolve, reject) => {
    OAuth.launchLogin({
      loginService: "oidc",
      loginStyle,
      loginUrl: loginUrl.toString(),
      credentialRequestCompleteCallback(tokenOrError) {
        if (typeof(tokenOrError) === "string") {
          // Only happens in 'popup' loginStyle
          resolve(tokenOrError);
        } else {
          reject(tokenOrError);
        }
      },
      credentialToken,
      popupOptions: config.popupOptions
    });
  });

  await new Promise<void>((resolve, reject) => {
    Accounts.oauth.tryLoginAfterPopupClosed(token, (errorOrUndefined) => {
      if (errorOrUndefined === undefined) {
        resolve();
      } else {
        reject(errorOrUndefined);
      }
    });
  });
}
