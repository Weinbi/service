// server/config/db.js
const knex = require('knex');

const db = knex({
  client: 'mysql2',
  connection: {
    host: 'localhost',
    user: 'root',      // 请修改
    password: '',      // 请修改
    database: 'education'
  },
  pool: { 
    min: 0, 
    max: 10 
  }
});

module.exports = db;