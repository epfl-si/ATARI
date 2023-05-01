import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import { getUserInfos } from './UserInfo'
type Options = { oidcToken: string }
type LoginStatus = Accounts.LoginMethodResult | undefined

registerLoginHandlerAsync<Options>("OIDC", checkTokenAndUpsertUser)

async function checkTokenAndUpsertUser (options: Options) : Promise<LoginStatus> {
    if (! options.oidcToken) {
      return undefined    // This login attempt is for another login handler, not us.
    }
    const userinfo = await getUserInfos(options.oidcToken)
    const userId = userinfo.preferred_username
    await Meteor.users.upsertAsync(userId, {$set: { username: userId, given_name: userinfo.given_name, family_name: userinfo.family_name, groups: userinfo.groups}})
    return { userId }
}


function registerLoginHandlerAsync <Options = any> (name: string, handlerAsync: (options: Options) => Promise<LoginStatus>) {
    // Adapted from https://blog.meteor.com/meteor-fibers-meet-promises-meet-callbacks-a-practical-guide-e134db15afcb#37e5
    return Accounts.registerLoginHandler(name, Meteor.wrapAsync((options : Options, callback: (error : Error, result?: Accounts.LoginMethodResult) => void) => {
        handlerAsync(options)
            .then((result) => {
                callback(null, result);
            })
            .catch((err) => {
                callback(err);
            });
    }) as any)
 }
