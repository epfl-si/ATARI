import { Issuer } from 'openid-client'
import { UserInfo } from '../../imports/types/UserInfo'

let _issuer: Issuer | undefined = undefined;

async function issuer() {
	if (_issuer) return _issuer;

	_issuer = await Issuer.discover(
    // TODO: this constant is also in the client; plus it is specific to the test platform.
    // We should 12-factor it (using Meteor.settings).
		// 'http://localhost:8080/realms/ATARI/'
    'https://tkgi-satosa.epfl.ch'
	);

	return _issuer;
}

export async function getUserInfos(oidcToken: string) : Promise<UserInfo> {
  const issuer_ = await issuer();
  const client = new issuer_.Client({ client_id: 'ATARI' });

    return await client.userinfo(oidcToken);
}
