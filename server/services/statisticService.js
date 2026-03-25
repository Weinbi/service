const StatisticModel = require('../models/statisticModel.js');

// 将 reference_code 映射到对应的执行函数
const FetcherRegistry = {
    "contract_balance": StatisticModel.getContractBalance,
    "consultant_sales_amount": StatisticModel.getConsultantSalesAmount,
    "teacher_consumed_value": StatisticModel.getTeacherConsumedValue
};

class StatisticService {
    /**
     * 统一计算分发入口
     * @param {String} reference_code - 统计项目代码
     * @param {Object} params - 统计所需的参数对象
     * @returns {Number} reference_data
     */
    static async calculate(reference_code, params) {
        const fetcherFn = FetcherRegistry[reference_code];
        if (!fetcherFn) {
            throw new Error(`未找到对应的统计计算函数: ${reference_code}`);
        }

        // 执行具体 Model 统计逻辑，并返回结果
        const reference_data = await fetcherFn(params);
        return reference_data;
    }
}

module.exports = StatisticService;