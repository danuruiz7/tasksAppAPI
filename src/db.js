import { createPool } from 'mysql2/promise';
import { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE } from './config.js';

export const pool = createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
});

// export const pool = createPool({
//   host: 'bqy7qybqaxeibhph2sxr-mysql.services.clever-cloud.com',
//   user: 'uuntwmg608k89b69',
//   password: 'bVtqrZcDic1SHjQehhc9',
//   database: 'bqy7qybqaxeibhph2sxr',
// });
