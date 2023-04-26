import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import { Issuer } from 'openid-client';

type Options = { oidcToken: string }
type LoginStatus = Accounts.LoginMethodResult | undefined
type UserInfo = {
	sub: string;
	given_name: string;
	family_name: string;
	groups: string[];
};

registerLoginHandlerAsync("OIDC", checkTokenAndUpsertUser)

async function checkTokenAndUpsertUser (options: Options) : Promise<LoginStatus> {
    console.log("registerLoginHandler")
    if (! options.oidcToken) {
      return undefined    // This login attempt is for another handler, not us.
    }
  
    const userId = "fred"    // TODO: probably needs improvement
    const userName = "Fred"  // TODO: same.
  
    const issuer_ = await issuer();
    const client = new issuer_.Client({ client_id: 'react-starter-kit' });
    const userinfo: UserInfo = await client.userinfo(options.oidcToken);
    console.log(userinfo); // TODO: upsert from info in userinfo, rather than Fred.
    
    await Meteor.users.upsertAsync(userId, {$set: {id: userId, username: userName}})
    return { userId }
}

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

function registerLoginHandlerAsync (name: string, handlerAsync: (options: any) => Promise<LoginStatus>)
{
    // Adapted from https://blog.meteor.com/meteor-fibers-meet-promises-meet-callbacks-a-practical-guide-e134db15afcb#37e5
    return Accounts.registerLoginHandler(Meteor.wrapAsync((options, callback) => {
        handlerAsync(options)
            .then((result) => {
                callback(null, result);
            })
            .catch((err) => {
                callback(err);
            });
    }) as any)
 }
