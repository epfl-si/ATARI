
/**
 * The type that Keycloak / SATOSA returns through `client.userinfo()`
 */
export type UserInfo = {
	sub: string;
	preferred_username: string;
	given_name: string;
	family_name: string;
	groups: string[];
}

/**
 * Some (not all) of these fields get copied into Meteor.users:
 */
declare module "meteor/meteor" {
	module Meteor {
		interface User {
			given_name: String
			family_name : String
		}
	}
}
