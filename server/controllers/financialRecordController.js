const FinancialRecordModel = require('../models/financialRecordModel');

class FinancialRecordController {
  // 获取财务流水列表
  static async list(ctx) {
    try {
      const records = await FinancialRecordModel.findAll();
      ctx.body = records;
    } catch (error) {
      ctx.status = 500;
      ctx.body = { message: '获取财务流水失败', error: error.message };
    }
  }

  // 添加财务流水
  static async add(ctx) {
    try {
      const { serial_no, campus_id, trade_type, category, amount, remark } = ctx.request.body;

      // ctx.state.user 通常经由鉴权中间件写入，如无则默认空
      const operator_id = ctx.state.user ? ctx.state.user.id : null;

      const newRecord = {
        serial_no,
        campus_id,
        trade_type,
        category,
        amount,
        remark,
        operator_id,
        transaction_date: new Date()
      };

      const id = await FinancialRecordModel.create(newRecord);
      ctx.body = { id, message: '财务流水添加成功' };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { message: '添加财务流水失败', error: error.message };
    }
  }
}

module.exports = FinancialRecordController;