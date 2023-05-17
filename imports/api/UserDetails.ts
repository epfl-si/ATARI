import { Meteor } from 'meteor/meteor';

export type UserDetails = {
  gaspar: string;
  sexe: 'M' | 'F' | string;
  account: {
    status: string;
  }
}
export const userDetailsCollection : Mongo.Collection<UserDetails> =
    Meteor.isClient ? new Mongo.Collection('userDetails') : undefined as any;

// This is effectively a singleton; make it available
// in the global `window` object for debugging purposes
declare global {
    interface Window {
        userDetailsCollection : typeof userDetailsCollection;
    }
}
window.userDetailsCollection = userDetailsCollection;
