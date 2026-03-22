// server/models/campusModel.js
const db = require('../config/db');

class CampusModel {
  // 获取所有校区
  static async findAll() {
    return await db('campuses').orderBy('created_at', 'desc');
  }

  // 根据ID获取校区
  static async findById(id) {
    return await db('campuses').where({ id }).first();
  }

  // 创建校区
  static async create(data) {
    const { name, address, status } = data;
    const [insertId] = await db('campuses').insert({ name, address, status });
    return insertId;
  }

  // 更新校区
  static async update(id, data) {
    const { name, address, status } = data;
    const affectedRows = await db('campuses')
      .where({ id })
      .update({ name, address, status });
    return affectedRows > 0;
  }

  // 删除校区 (物理删除，如需软删除请改为 update status=0)
  static async delete(id) {
    const affectedRows = await db('campuses').where({ id }).del();
    return affectedRows > 0;
  }
}

module.exports = CampusModel;