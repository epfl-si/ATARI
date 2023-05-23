import * as settings from '../../settings.json'
import * as mysql from 'mysql';

export default [
    function fetchMockAccountStatus(added, sciper){
        added("userDetails", sciper , { account: {status: "Compte désactivé"}});
    },
    function fetchPersonSql(added, sciper){
        let connection = mysql.createConnection(settings.mysql);
        connection.query(queryParams(sciper), wrapResultMap(added, sciper))
    }
]

const queryParams = (sciper) => {
    return {
        sql: 'SELECT * from Personnes where sciper = ?;',
        timeout: 5000,
        values: [sciper]
    }
}

function wrapResultMap(added, sciper){
    return (error, results, fields) => { 
        results.map((result) => {
            added("userDetails", sciper , result);
        })
    }
}
