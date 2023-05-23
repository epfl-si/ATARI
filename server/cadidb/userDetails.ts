import * as settings from '../../settings.json'
import * as mysql from 'mysql';

export default [
    function fetchMockAccountStatus(added, sciper){
        added("userDetails", sciper , { account: {status: "Compte désactivé"}});
    },
    function fetchPersonSql(added, sciper){
        let connection = mysql.createConnection(settings.mysql);
        connection.query({
            sql: 'SELECT * from Personnes where sciper = ?;',
            timeout: 5000,
            values: [sciper]
        }, (error, results, fields) => { 
            console.log("Person:", results)
            results.map((result) => {
                console.log("added:", sciper, result);
                added("userDetails", sciper , result);
            })
        })
    }
]
