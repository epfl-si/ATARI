import * as mysql from 'mysql';

import * as settings from '../settings.json'

var connection = mysql.createConnection({
    host     : settings.HOST,
    user     : settings.USER,
    password : settings.PASSWORD,
    database : settings.DATABASE,
    port     : settings.PORT
});

connection.connect();

connection.query({
    sql: 'SELECT * from Personnes where sciper LIKE ?;',
    timeout: 5000,
    values: ['%316897%']
}, function (error, results, fields) {
    console.log("Person:", results)
});

connection.end();
