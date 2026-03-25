const StatisticService = require('../services/statisticService.js');

const ReferenceDict = [
    {
        code: "teacher_consumed_value",
        name: "教师月度课消总额",
        category: "salary"
    },
    {
        code: "consultant_sales_amount",
        name: "顾问月度签约总额",
        category: "salary"
    },
    {
        code: "contract_balance",
        name: "合同账户余额",
        category: "refund"
    }
];

class StatisticController {

    // [GET] /api/statistics/referenceDict -> 前端获取下拉列表字典
    static async referenceDict(ctx) {
        try {
            ctx.status = 200;
            // 直接返回当前文件内定义的数组
            ctx.body = ReferenceDict;
        } catch (error) {
            ctx.status = 500;
            ctx.body = { error: 'INTERNAL_ERROR', message: error.message };
        }
    }

    // [POST] /api/statistics/calculate -> 供前端试算或获取单个统计数据
    static async calculateData(ctx) {
        try {
            const { reference_code, params } = ctx.request.body;

            if (!reference_code || !params) {
                ctx.status = 400;
                ctx.body = { error: 'BAD_REQUEST', message: '缺少必要的计算参数 (reference_code 或 params)' };
                return;
            }

            // 获取当前登录人信息
            const user = ctx.state.user;

            // 强制注入校区ID，确保单机构多校区的数据隔离安全
            const safeParams = {
                ...params,
                campus_id: user.campus_id
            };

            // 调用 Service 层进行计算
            const reference_data = await StatisticService.calculate(reference_code, safeParams);

            ctx.status = 200;
            ctx.body = {
                reference_code,
                reference_data
            };
        } catch (error) {
            // 捕获 Service 或 Model 中抛出的错误
            ctx.status = 500;
            ctx.body = { error: 'CALCULATION_FAILED', message: error.message };
        }
    }
}

module.exports = StatisticController;