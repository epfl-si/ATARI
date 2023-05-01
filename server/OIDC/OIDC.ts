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

// Publish the new fields that `checkTokenAndUpsertUser` added to the database.
// ⚠ We must discern whether this is a good idea!
// The Meteor server doesn't really need the personal identifying data. The cached copy it has can become stale.
Meteor.publish(null, function () {
    if (! this.userId) return
    return Meteor.users.find({
      _id: this.userId
    }, {
      fields: {
        given_name: 1,
        family_name: 1
      }
    });
  })


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
