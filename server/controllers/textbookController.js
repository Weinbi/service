const TextbookModel = require('../models/textbookModel');

class TextbookController {
    static async list(ctx) {
        try {
            const data = await TextbookModel.findAll();
            ctx.body = data;
        } catch (error) {
            ctx.status = 500;
            ctx.body = { message: '获取教材列表失败', error: error.message };
        }
    }

    static async add(ctx) {
        try {
            const { book_name, stock, unit_price, campus_id } = ctx.request.body;
            const user = ctx.state.user; // 假设 authMiddleware 将用户信息挂载到 state.user

            // 初始入库记录
            const distribution_records = [{
                operator_id: user.id,
                real_name: user.real_name,
                type: '入库',
                quantity: Number(stock),
                created_at: new Date().toLocaleString()
            }];

            await TextbookModel.create({
                book_name,
                stock: Number(stock),
                unit_price: Number(unit_price),
                campus_id,
                distribution_records
            });
            ctx.body = { message: '添加教材成功' };
        } catch (error) {
            ctx.status = 500;
            ctx.body = { message: '添加教材失败', error: error.message };
        }
    }

    static async update(ctx) {
        try {
            const { id } = ctx.params;
            const { book_name, unit_price } = ctx.request.body;
            // 按要求，仅允许修改 book_name 和 unit_price
            await TextbookModel.update(id, { 
                book_name, 
                unit_price: Number(unit_price) 
            });
            ctx.body = { message: '更新教材成功' };
        } catch (error) {
            ctx.status = 500;
            ctx.body = { message: '更新教材失败', error: error.message };
        }
    }

    static async remove(ctx) {
        try {
            const { id } = ctx.params;
            await TextbookModel.remove(id);
            ctx.body = { message: '删除教材成功' };
        } catch (error) {
            ctx.status = 500;
            ctx.body = { message: '删除教材失败', error: error.message };
        }
    }
}

module.exports = TextbookController;