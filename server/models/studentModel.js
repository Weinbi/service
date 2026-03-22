// server/models/studentModel.js
const db = require('../config/db');

class StudentModel {
  static async findAll() {
    // 关联查询负责的课程顾问姓名
    return await db('students as s')
      .leftJoin('users as u', 's.consultant_id', 'u.id')
      .select(
        's.id', 's.name', 's.parent_phone', 's.status',
        's.consultant_id', 's.created_at', 'u.real_name as consultant_name'
      )
      .orderBy('s.created_at', 'desc');
  }

  static async findById(id) {
    // 关联查询以在详情页展示负责顾问的姓名
    return await db('students as s')
      .leftJoin('users as u', 's.consultant_id', 'u.id')
      .where('s.id', id)
      .select('s.*', 'u.real_name as consultant_name')
      .first();
  }

  static async create(data) {
    const { name, parent_phone, status, consultant_id, records } = data;
    const [insertId] = await db('students').insert({
      name,
      parent_phone,
      status,
      consultant_id,
      records: JSON.stringify(records)
    });
    return insertId;
  }

  static async update(id, data) {
    const { name, parent_phone, status, consultant_id } = data;
    // 编辑时不更新 records
    const affectedRows = await db('students')
      .where({ id })
      .update({
        name,
        parent_phone,
        status,
        consultant_id
      });
    return affectedRows;
  }

  // 仅更新学生的 records 记录
  static async updateRecords(id, recordsStr) {
    const affectedRows = await db('students')
      .where({ id })
      .update({ records: recordsStr });
    return affectedRows;
  }

  static async delete(id) {
    const affectedRows = await db('students').where({ id }).del();
    return affectedRows;
  }
}

module.exports = StudentModel;