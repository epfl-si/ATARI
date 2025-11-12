import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'

interface Accred {
  unitid : number
  order: number
}

export interface Person {
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
  sapid: string;
  ownEmailAddrAuth: boolean;
  accreds?: Accred[];

  // Only for `personActiveDirectory` subscriptions:
  activeDirectory: {
    description: string;
    displayName: string;
    mail: string;
    userPrincipalName: string;
    sAMAccountName: string;
    uidNumber: number;
    gidNumber: number;
    memberOf: string[];
    unixHomeDirectory: string;
    loginShell: string;
    lastLogon: number;
    pwdLastSet: number;
    badPwdCount: number;
    badPasswordTime: number;
    baseUserAccountControl: string;
    userAccountControl: string;
    accountExpires: number;
    msExchRecipientTypeDetails: string;
  },

  // Only for `personLdap` subscriptions:
  ldap: {
    homeDirectory?: string;
  },

  // Only for `personScoldap` subscriptions:
  scoldap: {};
}

/**
 * Client-only collection for subscription results
 *
 * @locus Client
 */
export const Persons : Mongo.Collection<Person> | null = Meteor.isServer ? null :
  new Mongo.Collection("persons");
