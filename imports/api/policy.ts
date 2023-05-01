import { Meteor } from 'meteor/meteor'
import { readOnlyGroup } from '../12factor'

export function hasReadRole(user : Meteor.User) {
  if (Meteor.isServer) {
    return user.groups.some((g) => g === readOnlyGroup())
  } else { // On the client
    // Published by ../server/policy.ts
    return user.has_read_role
  }
}
