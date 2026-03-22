const ContractModel = require('../models/contractModel');
const db = require('../config/db');

class ContractController {
    static async list(ctx) {
        try {
            const contracts = await ContractModel.findAll();
            ctx.body = contracts;
        } catch (error) {
            ctx.status = 500;
            ctx.body = { message: '获取合同列表失败', error: error.message };
        }
    }

    static async preview(ctx) {
        try {
            const { studentId, courseId, purchasedHours, groupName } = ctx.request.body;
            if (!studentId || !courseId || !purchasedHours) {
                return ctx.body = { code: 400, message: '参数不全' };
            }

            const course = await db('courses').where({ id: courseId }).first();
            const student = await db('students').where({ id: studentId }).first();

            if (!course || !student) throw new Error('学生或课程不存在');

            // 1. 原价计算
            const basePrice = course.unit_price * purchasedHours;
            let discountedPrice = basePrice;
            const discountInfo = [];

            // 2. 课程折扣验证
            const schemes = typeof course.discount_scheme === 'string' ? JSON.parse(course.discount_scheme || '[]') : (course.discount_scheme || []);
            schemes.forEach(scheme => {
                let isEligible = true;
                const condition = scheme.condition || {};
                if (condition.min_hours && purchasedHours < condition.min_hours) isEligible = false;
                if (condition.student_status && student.status !== condition.student_status) isEligible = false;
                if (condition.end_date && new Date(condition.end_date) < new Date()) isEligible = false;

                if (isEligible) {
                    // 修改点：修正 % 后缀折扣的计算公式。
                    // 原先: (discountedPrice * (scheme.value / 100))，意味着减去了比如 80% 的原价。
                    // 修正后: 如果设定了 80%，实付应为原价的 80%，即应该减掉的金额是 discountedPrice * ((100 - 80) / 100)。
                    let amount = scheme.suffix === '%' ? (discountedPrice * ((100 - scheme.value) / 100)) : scheme.value;
                    discountedPrice -= amount;
                    discountInfo.push({ name: scheme.name, amount: Number(amount.toFixed(2)), value: scheme.value, suffix: scheme.suffix });
                }
            });

            // 3. 团购校验
            let groupInfo = [];
            const courseGroupSchemes = typeof course.group_scheme === 'string' ? JSON.parse(course.group_scheme || '[]') : (course.group_scheme || []);
            const selectedGroup = courseGroupSchemes.find(g => g.name === groupName);

            if (selectedGroup) {
                // 修改点：同样修正团购 % 的折扣计算。
                let gAmount = selectedGroup.suffix === '%' ? (discountedPrice * ((100 - selectedGroup.value) / 100)) : selectedGroup.value;
                discountedPrice -= gAmount;
                groupInfo.push({ name: selectedGroup.name, amount: Number(gAmount.toFixed(2)) ,value: selectedGroup.value, suffix: selectedGroup.suffix });
            }

            // 4. 提取教材数据
            const textbookConfigs = typeof course.textbook_config === 'string' ? JSON.parse(course.textbook_config || '[]') : (course.textbook_config || []);
            const textbooks = [];
            for (const tb of textbookConfigs) {
                const book = await db('textbooks').where({ id: tb.textbook_id }).first();
                if (book) {
                    textbooks.push({
                        id: book.id,
                        book_name: book.book_name,
                        unit_price: book.unit_price
                    });
                }
            }

            ctx.body = {
                code: 200,
                data: {
                    course_price: course.unit_price,
                    basePrice: Number(basePrice.toFixed(2)),
                    discountedPrice: Math.max(0, Number(discountedPrice.toFixed(2))),
                    discountInfo,
                    groupInfo,
                    textbooks
                }
            };
        } catch (error) {
            ctx.status = 400;
            ctx.body = { code: 400, message: error.message };
        }
    }

    static async add(ctx) {
        try {
            await ContractModel.create(ctx.request.body, ctx.state.user);
            ctx.body = { code: 200, message: '合同添加成功' };
        } catch (error) {
            ctx.status = 500;
            ctx.body = { message: '合同生成失败', error: error.message };
        }
    }

    static async update(ctx) {
        try {
            const { id } = ctx.params;
            const { remark } = ctx.request.body;
            await ContractModel.update(id, { remark });
            ctx.body = { code: 200, message: '更新成功' };
        } catch (error) {
            ctx.status = 500;
            ctx.body = { message: '更新合同失败', error: error.message };
        }
    }

    static async remove(ctx) {
        try {
            const { id } = ctx.params;
            await ContractModel.delete(id);
            ctx.body = { code: 200, message: '删除成功' };
        } catch (error) {
            ctx.status = 500;
            // 明确告诉前端具体错误原因，比如外键冲突
            ctx.body = { code: 500, message: '删除失败，该合同下可能还有关联的财务流水', error: error.message };
        }
    }
}

module.exports = ContractController;