import { Meteor } from 'meteor/meteor'

export function canAccessApp(user : Meteor.User) {
  if (Meteor.isServer) {
    return user.groups.some((g) => g === Meteor.settings.security.accessGroup)
  } else { // On the client
    // Published by ../server/policy.ts
    return user.has_access_right
  }
}
