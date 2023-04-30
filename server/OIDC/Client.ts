import { Issuer } from 'openid-client'
import { UserInfo } from '../../imports/types/UserInfo'

let _issuer: Issuer | undefined = undefined;

async function issuer() {
	if (_issuer) return _issuer;

	_issuer = await Issuer.discover(
    // TODO: this constant is also in the client; plus it is specific to the test platform.
    // We should 12-factor it (using Meteor.settings).
		'http://localhost:8080/realms/react-starter-kit/'
	);

	return _issuer;
}

const issuer_ = await issuer();
export const client = new issuer_.Client({ client_id: 'react-starter-kit' });

export async function getUserInfos(oidcToken: string){
    const userinfo: UserInfo = await client.userinfo(oidcToken);
		return userinfo
}
