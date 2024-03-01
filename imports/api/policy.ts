import { Meteor } from 'meteor/meteor'
import { canAccessGroup } from '../12factor'

export function canAccessApp(user : Meteor.User) {
  if (Meteor.isServer) {
    return user.groups.some((g) => g === canAccessGroup())
  } else { // On the client
    // Published by ../server/policy.ts
    return user.has_access_right
  }
}
