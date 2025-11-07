import { ServiceConfiguration } from "meteor/service-configuration"
import { OAuth } from "meteor/oauth"

import { OIDCConfiguration, LoginStyleString } from "./index"

/**
 * @locus client, server
 */
export async function getConfiguration() : Promise<OIDCConfiguration> {
  const config = await ServiceConfiguration.configurations.findOneAsync(
    { service: 'oidc' }) as OIDCConfiguration;
  if (!config) {
    throw new ServiceConfiguration.ConfigError();
  }
  return config;
}

/**
 * @return Either `"popup"` or `"redirect"`
 *
 * @locus client
 */
export async function getLoginStyle (
  options : any = {}
) : Promise<LoginStyleString> {
  // We want to call the private function here (rather than doing the
  // straightforward cascading-defaults ourselves), because it has
  // suitable bugware to force `"popup"` on Safari + IOS 8 in a
  // private window (for want of a working session storage in that
  // case).
  
  type OAuthPrivate = typeof OAuth & {
    // https://github.com/meteor/meteor/blob/master/packages/oauth/oauth_client.js
    _loginStyle (
      service: string, config: {loginStyle: LoginStyleString},
      options: any
    ) : LoginStyleString;
  }

  return (OAuth as OAuthPrivate)._loginStyle ('oidc', await getConfiguration(), options);
}
