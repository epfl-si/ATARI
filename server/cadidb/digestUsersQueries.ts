import { cadiSqlQuery } from '../databases/cadi_helpdesk';
import { DigestUser, DigestUsersCollection } from '../../imports/api/DigestUser';
import {publishUnderPolicy} from '../main'

async function insertDigestUser({ first_name, last_name, phone_number, sciper, gaspar, email }: Pick<DigestUser, 'first_name' | 'last_name' | 'phone_number' | 'sciper' | 'gaspar' | 'email'>) {
  await DigestUsersCollection.insertAsync({ first_name, last_name, phone_number, sciper, gaspar, email });
}
// Todo: cache these informations in order to not surcharge the db
export async function getDigestList(added){
    return await cadiSqlQuery({
        sql: `SELECT DISTINCT p.nom as last_name, p.prenom as first_name, p.sciper, p.email, p.username as gaspar,
                (SELECT GROUP_CONCAT(b.telephone1 SEPARATOR ', ') FROM Bottin b WHERE p.sciper = b.sciper) AS phone_number
            FROM Personnes p
            WHERE p.username IS NOT NULL;`,
        timeout: 50000,
    }, (error, results, fields) => { 
        if (results) {
            if (results[0]){
                let start = Date.now();
                added("digestusers", "usersKey", results)
                let timeTaken = Date.now() - start;
            }
        } else {
            console.error("No results in digestusers")
        }
    })
}
