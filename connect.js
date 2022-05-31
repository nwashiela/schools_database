const Pool = require("pg").Pool;

// const pool = new Pool({
//     user: 'postgres',
//     password: '123456',
//     database: 'postgres',
//     host: 'localhost',
//     port: 5432,
//     connectionString,
//     ssl : useSSL

// })
let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local){
    useSSL = true;
}

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:123456@localhost:5432/postgres';

// const pool = new Pool({
//     connectionString
//     // ssl : useSSL
//   });

  const pool = new Pool({
	connectionString, ssl: {
		rejectUnauthorized: false
	}
});

module.exports = pool;
