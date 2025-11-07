declare module 'meteor/oauth' {
  export const OAuth : {
    // https://github.com/meteor/meteor/blob/master/packages/oauth/oauth_server.js
    registerService (
      name: string, version: number, urls: string[],
      handleOauthRequest: (query: {code: string, state: string}) => void
    ) : void;

    // Per `_retrievePendingCredential` in
    // https://github.com/meteor/meteor/blob/master/packages/oauth/pending_credentials.js
    retrieveCredential (
      key : string,
      credentialSecret ?: string
    ) : Promise<void>;

    // https://github.com/meteor/meteor/blob/master/packages/oauth/oauth_client.js
    launchLogin (
      options: {
        loginService: string,
        loginStyle: 'popup' | 'redirect',
        loginUrl: string,
        credentialToken: string,
        credentialRequestCompleteCallback(error: null|Error, token?: string) : void,
        popupOptions?: any
      }
    ) : void;
  }
}
