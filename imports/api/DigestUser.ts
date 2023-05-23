import { Mongo } from 'meteor/mongo';

export interface DigestUser {
  _id?: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  sciper: string;
  gaspar: string;
  email: string;
}

export const DigestUsersCollection : Mongo.Collection<DigestUser> =
    Meteor.isClient ? new Mongo.Collection('digestusers') : undefined as any;;
