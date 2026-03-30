const db = require('../config/db');
const crypto = require('crypto');

class ContractModel {
    static async findAll() {
        return await db('contracts')
            .select(
                'contracts.*',
                'students.name as student_name',
                'courses.course_name',
                'campuses.name as campus_name'
            )
            .leftJoin('students', 'contracts.student_id', 'students.id')
            .leftJoin('courses', 'contracts.course_id', 'courses.id')
            .leftJoin('campuses', 'contracts.campus_id', 'campuses.id')
            .orderBy('contracts.created_at', 'desc');
    }

    static async create(data, operator) {
        const {
            student_id, course_id, purchased_hours, campus_id,
            remark, group_name, verify_code, discountInfo, groupInfo, peer_students,
            selected_textbooks, calculatedTuition, textbookFee, total_due,
            status, payment_method
        } = data;

        return await db.transaction(async (trx) => {
            // 1. 获取基础数据快照
            const course = await trx('courses').where({ id: course_id }).first();
            const student = await trx('students').where({ id: student_id }).first();

            // 构建合同快照信息
            let textbooksSnapshot = [];
            for (const tb of (selected_textbooks || [])) {
                const book = await trx('textbooks').where({ id: tb.id }).first();
                if (book) {
                    textbooksSnapshot.push({
                        textbook_id: book.id,
                        book_name: book.book_name,
                        quantity: tb.quantity,
                        unit_price: book.unit_price
                    });

                    await trx('textbooks').where({ id: tb.id }).update({
                        reserved_quantity: book.reserved_quantity + tb.quantity
                    });
                }
            }

            // 构建团购信息快照

            if (group_name) {
                if (group_name === '线上团购') groupInfo[0].verify_code = verify_code;
                if (group_name === '线下团购') groupInfo[0].peer_students = peer_students;
            }

            const courseSnapshot = {
                course_id, course_name: course.course_name, class_period: course.class_period, unit_price: course.unit_price
            };

            // 判断账户余额写入逻辑
            const account_balance = status === '已付款' ? total_due : 0;
            
            // 2. 插入合同记录
            const [contractId] = await trx('contracts').insert({
                student_id, course_id, purchased_hours, campus_id,
                remark, total_due,
                consultant_id: operator.id,
                student_snapshot: JSON.stringify({ name: student.name, parent_phone: student.parent_phone }),
                course_snapshot: JSON.stringify(courseSnapshot),
                textbook_info: JSON.stringify(textbooksSnapshot),
                discount_info: JSON.stringify(discountInfo),
                group_info: JSON.stringify(groupInfo),
                status: status || '已签约', // 修改：使用前端传递的状态，缺省则为已签约
                payment_method: payment_method || null,  // 新增：保存支付方式
                account_balance: account_balance
            });

            // 3. 插入财务流水 (学费与教材费拆分)
            if (calculatedTuition > 0) {
                await trx('financial_records').insert({
                    serial_no: `TU${Date.now()}${Math.floor(Math.random() * 1000)}`,
                    campus_id, trade_type: '收入', category: '学费',
                    amount: calculatedTuition, contract_id: contractId,
                    operator_id: operator.id, remark: remark,
                    payment_method: payment_method || null // 新增：保存支付方式到流水表
                });
            }
            if (textbookFee > 0) {
                await trx('financial_records').insert({
                    serial_no: `TB${Date.now()}${Math.floor(Math.random() * 1000)}`,
                    campus_id, trade_type: '收入', category: '教材费',
                    amount: textbookFee, contract_id: contractId,
                    operator_id: operator.id, remark: remark,
                    payment_method: payment_method || null // 新增：保存支付方式到流水表
                });
            }

            // 4. 更新学生跟进记录
            const stRecords = typeof student.records === 'string'
                ? JSON.parse(student.records || '[]')
                : (student.records || []);

            stRecords.push({
                id: crypto.randomBytes(4).toString('hex'),
                created_at: new Date().toLocaleString(),
                content: `已签约 ${course.course_name} 课程 ${purchased_hours} 课时`,
                operator: operator.real_name
            });

            await trx('students').where({ id: student_id }).update({
                records: JSON.stringify(stRecords),
                status: '已转化' // 跟进状态变更为已转化
            });

            return contractId;
        });
    }

    static async update(id, data) {
        return await db('contracts').where({ id }).update(data);
    }

    static async delete(id) {
        return await db('contracts').where({ id }).del();
    }
}

module.exports = ContractModel;