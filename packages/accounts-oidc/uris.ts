import { Meteor } from "meteor/meteor"
import { ServiceConfiguration } from "meteor/service-configuration"
import { getConfiguration, getLoginStyle } from "./config"

let cachedWellKnown : {
  token_endpoint ?: string
  user_info_endpoint ?: string
  authorization_endpoint ?: string
};

async function fetchWellKnown() {
  if (! cachedWellKnown) {
    const { baseUrl } = await getConfiguration();
    if (! baseUrl) {
      throw new ServiceConfiguration.ConfigError("`baseUrl` is not set in service configuration; unable to auto-detect endpoints.");
    }
    const response = await fetch(`${baseUrl}${baseUrl.endsWith("/") ? "": "/" }.well-known/openid-configuration`);
    cachedWellKnown = await response.json();
  }

  return cachedWellKnown;
}

function snakeToCamel(str : string) {
  return str.replace(/_([a-z0-9])/g, (match, p1) => p1.toUpperCase());
}

async function getEndpoint (endpointName : "token" | "userinfo" | "authorization") {
  const endpointNameFull = `${endpointName}_endpoint`;

  const config = await getConfiguration();
  const endpointNameInConfig = snakeToCamel(endpointNameFull);
  if (config[endpointNameInConfig]) {
    return config[endpointNameInConfig];
  }

  const wellKnown = await fetchWellKnown();
  const uri = wellKnown[endpointNameFull];
  if (uri.startsWith("/")) {
    if (config.baseUrl.endsWith("/")) {
      return `${config.baseUrl}${uri.substr(1)}`;
    } else {
      return `${config.baseUrl}${uri}`;
    }
  } else {
    return uri;
  }
}

/**
 * @return The URL of the `user_info` OAuth2 endpoint found in either
 * the `service-configuration` data or
 * `.well-known/service-configuration`, with priority to the former.
 *
 * @locus client, server
 */
export function getUserinfoEndpoint () : Promise<string> {
  return getEndpoint("userinfo")
}

/**
 * @return The URL of the `user_info` OAuth2 endpoint found in either
 * the `service-configuration` data or
 * `.well-known/service-configuration`, with priority to the former.
 *
 * @locus client, server
 */
export function getTokenEndpoint ()  : Promise<string> {
  return getEndpoint("token")
}

/**
 * @return The URL of the `authorization` OAuth2 endpoint found in either
 * the `service-configuration` data or
 * `.well-known/service-configuration`, with priority to the former.
 *
 * @locus client, server
 */
export function getAuthorizationEndpoint ()  : Promise<string> {
  return getEndpoint("authorization")
}

export function getMeteorUri (): string {
  return Meteor.absoluteUrl("");
}

/**
 * @return The URI to pass to the IdP as the OAuth redirection URI.
 *
 * ⚠ **This is not a configurable option.** The implementation of the
 * `meteor/oauth` package dictates that the return value be
 * `$ROOT_URL/ oauth/oidc`, regardless of even the `loginStyle`
 * configuration parameter.
 *
 * @locus client, server
 */
export function getRedirectionUri (): string {
  return Meteor.absoluteUrl("/_oauth/oidc");
}
