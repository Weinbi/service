// server/models/courseModel.js
const db = require('../config/db');

class CourseModel {
  static async findAll() {
    return await db('courses').orderBy('id', 'desc');
  }

  static async findById(id) {
    return await db('courses').where({ id }).first();
  }

  static async create(data) {
    const {
      course_name,
      class_period,
      unit_price,
      textbook_config = [],
      discount_scheme = [],
      group_scheme = [] // 接收团购数据
    } = data;

    const [insertId] = await db('courses').insert({
      course_name,
      class_period,
      unit_price,
      textbook_config: JSON.stringify(textbook_config),
      discount_scheme: JSON.stringify(discount_scheme),
      group_scheme: JSON.stringify(group_scheme) // 序列化存入
    });

    return insertId;
  }

  static async update(id, data) {
    const {
      course_name,
      class_period,
      unit_price,
      textbook_config = [],
      discount_scheme = [],
      group_scheme = [] // 接收团购数据
    } = data;

    const affectedRows = await db('courses')
      .where({ id })
      .update({
        course_name,
        class_period,
        unit_price,
        textbook_config: JSON.stringify(textbook_config),
        discount_scheme: JSON.stringify(discount_scheme),
        group_scheme: JSON.stringify(group_scheme) // 序列化更新
      });

    return affectedRows;
  }

  static async delete(id) {
    // 物理删除（如果需要软删除请像 UserModel 那样使用 update 状态）
    const affectedRows = await db('courses').where({ id }).del();
    return affectedRows;
  }
}

module.exports = CourseModel;