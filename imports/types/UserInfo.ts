
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
