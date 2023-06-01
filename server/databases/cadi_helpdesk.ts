import * as settings from '../../settings.json'
import * as mysql from 'mysql';

export async function cadiSqlQuery(queryParams: any, callbackFnc: Function) {
        let connection = mysql.createConnection(settings.mysql);
        await connection.query(queryParams, callbackFnc)
        connection.end(function(err) {
            console.log(err)
        });
    }
