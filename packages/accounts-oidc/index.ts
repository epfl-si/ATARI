import { Configuration } from "meteor/service-configuration"

type OIDC = {
  /**
   * Start the login process with the configured OpenID server.
   * Does not return (but may throw)
   *
   * @locus client
   */
  login (...args: any[]) : void
  /**
   * Start the logout process.
   * Does not return.
   *
   * @locus client
   */
  logout () : void
};

export type LoginStyleString = 'popup' | 'redirect';

export const OIDC = {} as OIDC;

export type OIDCConfiguration = Configuration & {
  loginStyle: LoginStyleString;  // default 'popup'
  scope: string | string[];
  loginUrlParameters: { [k : string] : string };
  clientId: string;
  secret ?: {  // Not published to client; see
               // https://github.com/search?q=repo%3Ameteor%2Fmeteor%20%22Publish%20all%20login%20service%20configuration%20fields%20other%20than%20secret%22&type=code
    clientSecret: string;
  }
  baseUrl?: string;
  tokenEndpoint?: string;
  userinfoEndpoint?: string;
  authorizeEndpoint?: string;
  popupOptions?: any;
}
