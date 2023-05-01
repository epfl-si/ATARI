import { Meteor } from 'meteor/meteor'
import { hasReadRole } from '../imports/api/policy'
import '../imports/types/UserInfo'

// Publish the new fields that `checkTokenAndUpsertUser` added to the database.
// ⚠ We must discern whether this is a good idea!
// The Meteor server doesn't really need the personal identifying data. The cached copy it has can become stale.
Meteor.publish(null, function () {
    if (! this.userId) return
  const [me] = Meteor.users.find({_id: this.userId}).fetch()
  this.added('users', me._id, {given_name: me.given_name, family_name: me.family_name,
                               has_read_role: hasReadRole(me)
                              });
  })
