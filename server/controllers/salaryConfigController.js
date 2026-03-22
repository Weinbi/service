// server/controllers/salaryConfigController.js
const db = require('../config/db');

exports.list = async (ctx) => {
  try {
    // Knex 返回的就是数据数组，不再需要 [rows] 解构
    const rows = await db('salary_config').orderBy('created_at', 'desc');
    ctx.body = rows;
  } catch (error) {
    console.error(error);
    ctx.status = 500;
    ctx.body = { message: '获取薪酬配置列表失败' };
  }
};

exports.add = async (ctx) => {
  const { type, name, reference_code, min, max, suffix } = ctx.request.body;
  try {
    // 使用 Knex 的 insert，直接解构拿到 insertId
    const [insertId] = await db('salary_config').insert({
      type,
      name,
      reference_code: reference_code || null,
      min: min || 0,
      max: max || 0,
      suffix: suffix || ''
    });
    ctx.body = { message: '添加成功', id: insertId };
  } catch (error) {
    console.error(error);
    ctx.status = 500;
    ctx.body = { message: '添加失败' };
  }
};

exports.update = async (ctx) => {
  const id = ctx.params.id;
  const { type, name, reference_code, min, max, suffix } = ctx.request.body;
  try {
    // 使用 Knex 的 update
    await db('salary_config')
      .where({ id })
      .update({
        type,
        name,
        reference_code: reference_code || null,
        min: min || 0,
        max: max || 0,
        suffix: suffix || ''
      });
    ctx.body = { message: '更新成功' };
  } catch (error) {
    console.error(error);
    ctx.status = 500;
    ctx.body = { message: '更新失败' };
  }
};

exports.remove = async (ctx) => {
  const id = ctx.params.id;
  try {
    // 使用 Knex 的 del()
    await db('salary_config').where({ id }).del();
    ctx.body = { message: '删除成功' };
  } catch (error) {
    console.error(error);
    ctx.status = 500;
    ctx.body = { message: '删除失败' };
  }
};