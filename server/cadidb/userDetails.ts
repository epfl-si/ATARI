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
    },
    function fetchUnitsInfos(added, sciper){
        cadiSqlQuery({
            sql:`
                SELECT * from Accreds a
                LEFT JOIN Unites u on a.unite  = u.id_unite
                WHERE sciper = ?;
            `,
            timeout: 5000,
            values: [sciper]
        }, (error, results, fields) => {
            if (results) {
                if (results[0]) {
                    const statuts = ['Personnel', 'Hôte', 'Hors EPFL', 'Inconnu', 'Etudiant', 'Alumni', 'Retraité']
                    // TypeError: Cannot read property '0' of undefined
                    if (results[0]?.statut){
                        results.map((result) => result.statut = statuts[result.statut - 1])
                    }
                    added("userDetails", sciper , { units: [...results] });
                } else {
                    console.error("No results[0] found...")
                }
            } else {
                console.error("No results found...")
            }
        })
    },
]
