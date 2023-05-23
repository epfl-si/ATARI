import { Meteor } from 'meteor/meteor';
import {publishUnderPolicy} from './main'
import dataFetchers from './cadidb/userDetails'
import { DigestUser, DigestUsersCollection } from '../imports/api/DigestUser';
import { getDigestList } from './cadidb/digestUsersQueries'

publishUnderPolicy("userDetails", function (sciper : string) {
  sciper = String(sciper);
  sciper = (sciper.match(/^([A-Z]?\d+)$/) as any)[0];
  dataFetchers.forEach(x => x((...args) => this.added(...args), sciper))
  this.ready()
});
  
publishUnderPolicy("digestusers", async function () {
  getDigestList((...args) => this.added(...args))
  this.ready()
});
