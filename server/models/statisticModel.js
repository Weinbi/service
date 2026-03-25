const db = require('../config/db');

class StatisticModel {

  // 获取合同余额
  static async getContractBalance(params) {
    const { contract_id } = params;
    const contract = await db('contracts')
      .select('account_blance') // 对应 database.sql 中的拼写
      .where({ id: contract_id })
      .first();

    return contract ? Number(contract.account_blance) : 0;
  }

  // 统计顾问月度签约总额
  static async getConsultantSalesAmount(params) {
    const { user_id, campus_id, month } = params;
    const result = await db('contracts')
      .sum('total_due as total')
      .where({ consultant_id: user_id, campus_id: campus_id })
      .andWhere('status', '已签约')
      .andWhereRaw("DATE_FORMAT(contract_date, '%Y-%m') = ?", [month])
      .first();

    return result && result.total ? Number(result.total) : 0;
  }

  // 统计教师月度课消总额
  static async getTeacherConsumedValue(params) {
    const { user_id, campus_id, month } = params;

    const attendances = await db('attendance')
      .join('classes', 'attendance.class_id', 'classes.id')
      .select('attendance.records', 'attendance.class_id')
      .where('classes.teacher_id', user_id)
      .andWhere('classes.campus_id', campus_id)
      .andWhereRaw("DATE_FORMAT(attendance.created_at, '%Y-%m') = ?", [month]);

    let totalValue = 0;

    for (const att of attendances) {
      const records = typeof att.records === 'string' ? JSON.parse(att.records) : att.records;

      for (const studentRecord of records) {
        if (studentRecord.status === '出勤' || studentRecord.status === '补课') {
          const studentClass = await db('student_classes')
            .select('average_unit_price')
            .where({ student_id: studentRecord.student_id, class_id: att.class_id })
            .first();

          const unitPrice = studentClass ? Number(studentClass.average_unit_price) : 0;
          totalValue += (Number(studentRecord.consume_hours) * unitPrice);
        }
      }
    }
    return totalValue;
  }
}

module.exports = StatisticModel;