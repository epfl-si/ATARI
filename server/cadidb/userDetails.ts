import { cadiSqlQuery } from '../databases/cadi_helpdesk';

export default [
    function fetchMockAccountStatus(added, sciper){
        added("userDetails", sciper , { account: {status: "Compte désactivé"}});
    },
    function fetchPersonSql(added, sciper){
        cadiSqlQuery(() => getPersonQueryParams(sciper), () => wrapResultMap(added, sciper))
    }
]

const getPersonQueryParams = (sciper) => {
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
