const StudentModel = require('../models/studentModel');
const crypto = require('crypto'); // 引入 crypto 模块生成随机 ID

class StudentController {
  // 获取列表
  static async list(ctx) {
    try {
      const students = await StudentModel.findAll();
      ctx.body = students;
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: '获取学生列表失败' };
    }
  }

  // 获取详情
  static async detail(ctx) {
    try {
      const student = await StudentModel.findById(ctx.params.id);
      if (!student) {
        ctx.status = 404;
        ctx.body = { error: '学生不存在' };
        return;
      }
      ctx.body = student;
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: '获取学生详情失败' };
    }
  }

  // 创建学生
  static async add(ctx) {
    try {
      const { name, parent_phone, status, initial_record } = ctx.request.body;
      const consultant_id = ctx.state.user.id; // 从中间件获取当前登录用户ID
      const consultant_name = ctx.state.user.real_name;

      if (!name || !parent_phone) {
        ctx.status = 400;
        ctx.body = { error: '请填写必填项' };
        return;
      }

      // 构造初次跟进记录，加入随机唯一 id 用于前端渲染列表
      const newRecords = [{
        id: crypto.randomBytes(4).toString('hex'), // 添加唯一标识符
        created_at: new Date().toLocaleString(),
        operator: consultant_name,
        content: initial_record || '新建学生线索'
      }];

      const id = await StudentModel.create({
        name,
        parent_phone,
        status: status || '新线索',
        consultant_id,
        records: newRecords
      });
      ctx.status = 201;
      ctx.body = { message: '创建成功', id };
    } catch (error) {
      console.error(error);
      ctx.status = 500;
      ctx.body = { error: '创建失败' };
    }
  }

  // 更新学生
  static async update(ctx) {
    try {
      const { id } = ctx.params;
      const { name, parent_phone } = ctx.request.body;
      // 假设如果更改，依然属于当前操作的顾问，或者不更改顾问ID，这里简化处理，保持原顾问或更新为当前顾问
      const consultant_id = ctx.state.user.id;

      const result = await StudentModel.update(id, { name, parent_phone, consultant_id });
      if (result) {
        ctx.body = { message: '更新成功' };
      } else {
        ctx.status = 404;
        ctx.body = { error: '学生不存在或无变化' };
      }
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: '更新失败' };
    }
  }

  // 删除学生
  static async remove(ctx) {
    try {
      const { id } = ctx.params;
      await StudentModel.delete(id);
      ctx.body = { message: '删除成功' };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: '删除失败' };
    }
  }

  // 添加跟进动态
  static async addRecord(ctx) {
    try {
      const { id } = ctx.params;
      const { content } = ctx.request.body;
      const consultant_name = ctx.state.user.real_name; // 获取当前登录人姓名

      if (!content) {
        ctx.status = 400;
        ctx.body = { error: '跟进内容不能为空' };
        return;
      }

      const student = await StudentModel.findById(id);
      if (!student) {
        ctx.status = 404;
        ctx.body = { error: '学生不存在' };
        return;
      }

      // 解析现有的 records
      let records = student.records || [];
      if (typeof records === 'string') {
        try { records = JSON.parse(records); } catch (e) { records = []; }
      }

      // 构造新记录
      const newRecord = {
        id: crypto.randomBytes(4).toString('hex'), // 生成8位短ID
        created_at: new Date().toLocaleString(),
        operator: consultant_name,
        content
      };

      records.push(newRecord);

      // 更新数据库
      await StudentModel.updateRecords(id, JSON.stringify(records));

      ctx.status = 201;
      ctx.body = { message: '添加成功', record: newRecord };
    } catch (error) {
      console.error(error);
      ctx.status = 500;
      ctx.body = { error: '添加跟进记录失败' };
    }
  }
}

module.exports = StudentController;