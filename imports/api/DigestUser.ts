import { Mongo } from 'meteor/mongo';

export interface DigestUser {
  _id?: string;
  firstname: string;
  lastname: string;
  phone_number: string;
  id: string;
  account: {username: string};
  email: string;
}

export const DigestUsersCollection : Mongo.Collection<DigestUser> =
    Meteor.isClient ? new Mongo.Collection('digestusers') : undefined as any;;
