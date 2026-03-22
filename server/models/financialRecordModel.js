const db = require('../config/db');

class FinancialRecordModel {
  // 获取所有流水记录，附带校区和操作人的外键联查展示
  static async findAll() {
    return db('financial_records')
      .leftJoin('campuses', 'financial_records.campus_id', 'campuses.id')
      .leftJoin('users', 'financial_records.operator_id', 'users.id')
      .select(
        'financial_records.*', 
        'campuses.name as campus_name', 
        'users.real_name as operator_name'
      )
      .orderBy('transaction_date', 'desc');
  }

  // 插入新的财务记录
  static async create(data) {
    const [id] = await db('financial_records').insert(data);
    return id;
  }
}

module.exports = FinancialRecordModel;