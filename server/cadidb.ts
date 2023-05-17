import * as mysql from 'mysql';
import { Meteor } from 'meteor/meteor';
import * as settings from '../settings.json'
import {publishUnderPolicy} from './main'

publishUnderPolicy("userDetails", function (sciper : string) {
  sciper = String(sciper);
  sciper = (sciper.match(/^([A-Z]?\d+)$/) as any)[0];

  // TODO: refactor the 3 lines above into main.ts and have them call
  //       fetchUserDetailsSQL(this.added);
  //       fetchUserDetailsLDAP(this.added);

   this.added("userDetails", sciper , { account: {status: "Compte désactivé"}});

  let connection = mysql.createConnection(settings.mysql);
  connection.query({
    sql: 'SELECT * from Personnes where sciper = ?;',
    timeout: 5000,
    values: [sciper]
  }, (error, results, fields) => {
      console.log("Person:", results)
      results.map((result) => {
        console.log("added:", sciper, result);
        this.added("userDetails", sciper , result);
      })
      this.ready()
    })
  }
);
  
