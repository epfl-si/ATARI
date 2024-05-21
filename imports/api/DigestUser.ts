import { Mongo } from 'meteor/mongo';

export interface DigestUser {
  _id?: string;
  firstname: string;
  lastname: string;
  phone_number: string;
  id: string;
  account: {
    username: string;
    gid: number;
    home: string;
  };
  email: string;
  gender: 'M' | 'F' | string;
  physemail: string;
  phones: [
    {
      unitid: string;
      roomid: number;
      roomname: string;
      id: number;
      hidden: number;
      order: number;
      number: string;
      fromdefault: number;
    }
  ];
  addresses: [
    {
      unitid: string;
      type: string;
      address: string;
      country: string;
      part1: string;
      part2: string;
      part3: string;
      part4: string;
      fromdefault: number;
    }
  ];
  automap: {
    protocol: string;
    server: string;
    path: string;
    security: string;
  };
  position: {
    labelfr: string;
    labelen: string;
    labelxx: string;
    labelinclusive: string;
  };
  org: string;
  status: string;
  type: string;
}

export const DigestUsersCollection : Mongo.Collection<DigestUser> =
    Meteor.isClient ? new Mongo.Collection('digestusers') : undefined as any;;
