import { Meteor } from 'meteor/meteor';
import {publishUnderPolicy} from './main'
import dataFetchers from './cadidb/userDetails'

publishUnderPolicy("userDetails", function (sciper : string) {
    sciper = String(sciper);
    sciper = (sciper.match(/^([A-Z]?\d+)$/) as any)[0];
    dataFetchers.forEach(x => x((...args) => this.added(...args), sciper))
    this.ready()
  }
);
  
