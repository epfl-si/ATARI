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
                JOIN Unites u on a.unite  = u.id_unite
                WHERE sciper = ?;
            `,
            timeout: 5000,
            values: [sciper]
        }, (error, results, fields) => {
            const statuts = ['Personnel', 'Hôte', 'Hors EPFL', 'Inconnu', 'Etudiant', 'Alumni', 'Retraité']
            if (results[0]?.statut){
                results[0].statut = statuts[results[0].statut - 1];
            }
            added("userDetails", sciper , { units: [...results] });
        })
    }
]
