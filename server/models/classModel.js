// server/models/classModel.js
const db = require('../config/db');

class ClassModel {
  // 获取列表并关联查询所需字段
  static async findAll() {
    return await db('classes as c')
      .leftJoin('courses as co', 'c.course_id', 'co.id')
      .leftJoin('campuses as ca', 'c.campus_id', 'ca.id')
      .leftJoin('users as u', 'c.teacher_id', 'u.id')
      .select(
        'c.*',
        'co.course_name',
        'ca.name AS campus_name',
        'u.real_name AS teacher_name'
      )
      .orderBy('c.id', 'desc');
  }

  // 创建新班级
  static async create(classData) {
    const { course_id, campus_id, teacher_id, class_name, max_capacity, status } = classData;
    const [insertId] = await db('classes').insert({
      course_id,
      campus_id,
      teacher_id,
      class_name,
      max_capacity,
      status: status || '开课中'
    });
    return insertId;
  }

  // 更新班级信息
  static async update(id, classData) {
    const { course_id, campus_id, teacher_id, class_name, max_capacity, status } = classData;
    const affectedRows = await db('classes')
      .where({ id })
      .update({
        course_id,
        campus_id,
        teacher_id,
        class_name,
        max_capacity,
        status
      });
    return affectedRows;
  }

  // 删除班级
  static async remove(id) {
    const affectedRows = await db('classes').where({ id }).del();
    return affectedRows;
  }
}

module.exports = ClassModel;