const ClassModel = require('../models/classModel');

// 列表查询
exports.list = async (ctx) => {
  try {
    const classes = await ClassModel.findAll();
    ctx.body = classes;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: '获取班级列表失败', error: error.message };
  }
};

// 创建记录
exports.add = async (ctx) => {
  try {
    const classData = ctx.request.body;
    const insertId = await ClassModel.create(classData);
    ctx.body = { message: '班级创建成功', id: insertId };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: '创建班级失败', error: error.message };
  }
};

// 更新记录
exports.update = async (ctx) => {
  try {
    const { id } = ctx.params;
    const classData = ctx.request.body;
    await ClassModel.update(id, classData);
    ctx.body = { message: '班级更新成功' };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: '更新班级失败', error: error.message };
  }
};

// 删除记录
exports.remove = async (ctx) => {
  try {
    const { id } = ctx.params;
    await ClassModel.remove(id);
    ctx.body = { message: '班级删除成功' };
  } catch (error) {
    ctx.status = 500;
    // 如果有关联的报名数据（student_classes表有记录），可能会触发外键约束导致删除失败
    ctx.body = { message: '删除班级失败，可能存在外键约束或关联数据', error: error.message };
  }
};