const CampusModel = require('../models/campusModel');

class CampusController {
  // 获取列表
  static async list(ctx) {
    try {
      const list = await CampusModel.findAll();
      ctx.body = list;
    } catch (err) {
      ctx.status = 500;
      ctx.body = { message: '获取校区列表失败: ' + err.message };
    }
  }

  // 添加校区
  static async add(ctx) {
    const { name, address, status } = ctx.request.body;
    if (!name) {
      ctx.status = 400;
      ctx.body = { message: '校区名称不能为空' };
      return;
    }
    try {
      const id = await CampusModel.create({ name, address, status });
      ctx.body = { message: '添加成功', id };
    } catch (err) {
      ctx.status = 500;
      ctx.body = { message: '添加失败: ' + err.message };
    }
  }

  // 更新校区
  static async update(ctx) {
    const id = ctx.params.id;
    try {
      const success = await CampusModel.update(id, ctx.request.body);
      if (success) {
        ctx.body = { message: '更新成功' };
      } else {
        ctx.status = 404;
        ctx.body = { message: '校区不存在或未变更' };
      }
    } catch (err) {
      ctx.status = 500;
      ctx.body = { message: '更新失败: ' + err.message };
    }
  }

  // 删除校区
  static async remove(ctx) {
    const id = ctx.params.id;
    try {
      const success = await CampusModel.delete(id);
      if (success) {
        ctx.body = { message: '删除成功' };
      } else {
        ctx.status = 404;
        ctx.body = { message: '校区不存在' };
      }
    } catch (err) {
      ctx.status = 500;
      ctx.body = { message: '删除失败: ' + err.message };
    }
  }
}

module.exports = CampusController;