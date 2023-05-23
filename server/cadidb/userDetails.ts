import { cadiSqlQuery } from '../databases/cadi_helpdesk';

export default [
    function fetchMockAccountStatus(added, sciper){
        added("userDetails", sciper , { account: {status: "Compte désactivé"}});
    },
    function fetchPersonSql(added, sciper){
        cadiSqlQuery({
            sql: 'SELECT * from Personnes where sciper = ?;',
            timeout: 5000,
            values: [sciper]
        }, (error, results, fields) => { 
            added("userDetails", sciper , ...results);
        })
    }
]
