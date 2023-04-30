import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import { client, getUserInfos } from './Client'

type Options = { oidcToken: string }
type LoginStatus = Accounts.LoginMethodResult | undefined

registerLoginHandlerAsync("OIDC", checkTokenAndUpsertUser)

async function checkTokenAndUpsertUser (options: Options) : Promise<LoginStatus> {
    console.log("registerLoginHandler")
    if (! options.oidcToken) {
      return undefined    // This login attempt is for another handler, not us.
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
