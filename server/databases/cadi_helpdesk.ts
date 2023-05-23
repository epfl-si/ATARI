import * as settings from '../../settings.json'
import * as mysql from 'mysql';


export function cadiSqlQuery(queryParams: any, callbackFnc: Function): void {
    let connection = mysql.createConnection(settings.mysql);
        connection.query(queryParams, callbackFnc)
    }
