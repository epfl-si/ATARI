import { cadiSqlQuery } from '../databases/cadi_helpdesk';
import { DigestUser, DigestUsersCollection } from '../../imports/api/DigestUser';
import {publishUnderPolicy} from '../main'

async function insertDigestUser({ first_name, last_name, phone_number, sciper, gaspar, email }: Pick<DigestUser, 'first_name' | 'last_name' | 'phone_number' | 'sciper' | 'gaspar' | 'email'>) {
  await DigestUsersCollection.insertAsync({ first_name, last_name, phone_number, sciper, gaspar, email });
}
// Todo: cache these informations in order to not surcharge the db
export async function getDigestList(added){
    return await cadiSqlQuery({
        sql: `SELECT DISTINCT p.nom as last_name, p.prenom as first_name, p.sciper, p.email, p.username as gaspar, b.telephone1 as phone_number 
                FROM Personnes p
                LEFT JOIN Bottin b ON p.sciper = b.sciper
                WHERE p.username IS NOT NULL`,
        timeout: 50000,
    }, (error, results, fields) => { 
        if(results[0]){
            let start = Date.now();
            added("digestusers", "usersKey", results)
            let timeTaken = Date.now() - start;
        }
        
    })
}
