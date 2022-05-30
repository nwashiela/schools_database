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

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:123456@localhost:5432/postgres';

const pool = new Pool({
    connectionString,
    // ssl : useSSL
  });

module.exports = pool;
