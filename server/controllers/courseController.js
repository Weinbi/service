const CourseModel = require('../models/courseModel');

class CourseController {
    static async list(ctx) {
        try {
            const courses = await CourseModel.findAll();
            ctx.body = courses;
        } catch (err) {
            ctx.status = 500;
            ctx.body = { message: '获取课程列表失败', error: err.message };
        }
    }

    static async add(ctx) {
        try {
            const insertId = await CourseModel.create(ctx.request.body);
            ctx.status = 201;
            ctx.body = { message: '课程创建成功', id: insertId };
        } catch (err) {
            ctx.status = 500;
            ctx.body = { message: '创建课程失败', error: err.message };
        }
    }

    static async update(ctx) {
        try {
            const id = ctx.params.id;
            const affectedRows = await CourseModel.update(id, ctx.request.body);
            if (affectedRows > 0) {
                ctx.body = { message: '课程更新成功' };
            } else {
                ctx.status = 404;
                ctx.body = { message: '课程不存在' };
            }
        } catch (err) {
            ctx.status = 500;
            ctx.body = { message: '更新课程失败', error: err.message };
        }
    }

    static async remove(ctx) {
        try {
            const id = ctx.params.id;
            // 检查是否有外键引用（比如 classes, student_classes 或 course_balance_logs 表如果已经存在引用此课程的记录可能会报错）
            const affectedRows = await CourseModel.delete(id);
            if (affectedRows > 0) {
                ctx.body = { message: '课程删除成功' };
            } else {
                ctx.status = 404;
                ctx.body = { message: '课程不存在' };
            }
        } catch (err) {
            ctx.status = 500;
            // 如果触发了外键RESTRICT报错，可以直接反馈给用户
            if (err.code === 'ER_ROW_IS_REFERENCED_2') {
                ctx.body = { message: '删除失败: 该课程已被班级或合同引用，无法删除' };
            } else {
                ctx.body = { message: '删除课程失败', error: err.message };
            }
        }
    }
}

module.exports = CourseController;