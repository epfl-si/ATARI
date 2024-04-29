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
        }, async (error, results, fields) => {
            if (results) {
                if (results[0]) {
                    const statuts = ['Personnel', 'Hôte', 'Hors EPFL', 'Inconnu', 'Etudiant', 'Alumni', 'Retraité']
                    // TypeError: Cannot read property '0' of undefined
                    if (results[0]?.statut){
                        results.map((result) => result.statut = statuts[result.statut - 1])
                    }
                    let newResults:any = [];
                    await Promise.all(results.map(async result => {
                        const allUnits = [result.level1, result.level2, result.level3, result.level4]
                        const adminResults = await new Promise((resolve, reject) => {
                            cadiSqlQuery({
                                sql:`
                                    SELECT u.sigle, rp.nom, rp.sciper, p.nom, p.prenom, p.email
                                    FROM RolesPersonnes as rp, Personnes as p, Unites as u
                                    where rp.sciper = p.sciper
                                    and u.id_unite = rp.unite
                                    and rp.unite in (?)
                                    and rp.nom = 'AdminIT'
                                    order by u.niveau desc;`,
                                timeout: 5000,
                                values: [allUnits]
                            }, async (error, adminResults, fields) => {
                                if(adminResults) {
                                    if(adminResults[0]) {
                                        resolve(adminResults)
                                    } else {
                                        console.log("No adminResults[0] found...");
                                        resolve('')
                                    }
                                }
                            })
                        })
                        if(adminResults) {
                            result.adminsIT = adminResults;
                        } else {
                            result.adminsIT = [];
                        }
                        newResults.push(result)
                    }))
                    added("userDetails", sciper , { units: [...newResults] });
                } else {
                    console.error("No results[0] found...")
                }
            } else {
                console.error("No results found...")
            }
        })
    },
]
