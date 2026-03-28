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
      group_scheme = [],
      performance_scheme = [],
      refund_scheme = []
    } = data;

    const [insertId] = await db('courses').insert({
      course_name,
      class_period,
      unit_price,
      textbook_config: JSON.stringify(textbook_config),
      discount_scheme: JSON.stringify(discount_scheme),
      group_scheme: JSON.stringify(group_scheme),
      performance_scheme: JSON.stringify(performance_scheme),
      refund_scheme: JSON.stringify(refund_scheme),
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
      group_scheme = [],
      performance_scheme = [],
      refund_scheme = []
    } = data;

    const affectedRows = await db('courses')
      .where({ id })
      .update({
        course_name,
        class_period,
        unit_price,
        textbook_config: JSON.stringify(textbook_config),
        discount_scheme: JSON.stringify(discount_scheme),
        group_scheme: JSON.stringify(group_scheme),
        performance_scheme: JSON.stringify(performance_scheme),
        refund_scheme: JSON.stringify(refund_scheme)
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