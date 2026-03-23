// server/config/db.js
const knex = require('knex');

const db = knex({
  client: 'mysql2',
  connection: {
    host: 'localhost',
    user: 'root',      // 请修改
    password: '',      // 请修改
    database: 'education',
    timezone: '+08:00', // 设定为东八区（根据你的实际当地时区调整）
    dateStrings: true,  // 强制以纯字符串格式（'YYYY-MM-DD HH:mm:ss'）返回，阻止转为 JS Date 对象
  },
  pool: { 
    min: 0, 
    max: 10 
  }
});

module.exports = db;