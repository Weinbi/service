// server/controllers/roleController.js
const RoleModel = require('../models/roleModel');

class RoleController {
  // 获取角色列表
  static async list(ctx) {
    try {
      const roles = await RoleModel.findAll();
      ctx.body = roles;
    } catch (err) {
      console.error('获取角色列表失败:', err);
      ctx.status = 500;
      ctx.body = { message: '获取角色列表失败: ' + err.message };
    }
  }

  // 新增角色 (对应 POST /api/roles)
  static async add(ctx) {
    try {
      const roleData = ctx.request.body;

      if (!roleData.role_name) {
        ctx.status = 400;
        ctx.body = { message: '角色名称为必填项' };
        return;
      }

      const insertId = await RoleModel.create(roleData);
      ctx.status = 201;
      ctx.body = { message: '角色创建成功', id: insertId };
    } catch (err) {
      console.error('创建角色失败:', err);
      ctx.status = 500;
      ctx.body = { message: '创建角色失败: ' + err.message };
    }
  }

  // 更新角色 (对应 PUT /api/roles/:id)
  static async update(ctx) {
    try {
      const id = ctx.params.id;
      const roleData = ctx.request.body;

      if (!roleData.role_name) {
        ctx.status = 400;
        ctx.body = { message: '角色名称不能为空' };
        return;
      }

      const affectedRows = await RoleModel.update(id, roleData);

      if (affectedRows === 0) {
        ctx.status = 404;
        ctx.body = { message: '角色不存在或未发生修改' };
        return;
      }

      ctx.body = { message: '角色更新成功' };
    } catch (err) {
      console.error('更新角色失败:', err);
      ctx.status = 500;
      ctx.body = { message: '更新角色失败: ' + err.message };
    }
  }

  // 删除角色 (对应 DELETE /api/roles/:id)
  static async remove(ctx) {
    try {
      const id = ctx.params.id;

      // 如果你在 model 中实现了依赖检查，可以在这里调用
      const hasUser = await RoleModel.checkUserDependency(id);
      if (hasUser) {
        ctx.status = 400;
        ctx.body = { message: '无法删除：有用户正在使用此角色' };
        return;
      }

      const affectedRows = await RoleModel.delete(id);

      if (affectedRows === 0) {
        ctx.status = 404;
        ctx.body = { message: '角色不存在' };
        return;
      }

      ctx.body = { message: '角色删除成功' };
    } catch (err) {
      console.error('删除角色失败:', err);
      ctx.status = 500;
      ctx.body = { message: '删除角色失败: ' + err.message };
    }
  }

  static async permissionList(ctx) {
    const permissions = [
      { code: "enroll:manage", name: "招生", desc: "招生、注册" },
      { code: "teaching:manage", name: "教学", desc: "上课签到、发教材" },
      { code: "academic:manage", name: "教务", desc: "排课" },
      { code: "hr:manage", name: "人事", desc: "用户权限和信息" },
      { code: "finance:manage", name: "财务", desc: "财务数据和流水记录" },
    ];
    ctx.body = permissions;
  }

  static async salarySchemeList(ctx) {
    const salarySchemes = [
      { type: "基本工资", name: "月薪", reference_code: null, value: 0, suffix: "元" },
      { type: "奖金", name: "全勤奖", reference_code: "attendance_days", value: 0, suffix: "元" },
      { type: "津贴和补贴", name: "餐补", reference_code: null, value: 0, suffix: "元" },
      { type: "津贴和补贴", name: "交通补贴", reference_code: null, value: 0, suffix: "元" },
      { type: "加班加点工资", name: "假期校外教学", reference_code: "off_campus_teaching_hours", value: 0, suffix: "元" },
      { type: "特殊情况下支付的工资", name: "产假工资", reference_code: null, value: 0, suffix: "元" }
    ];
    ctx.body = salarySchemes;
  }

  static async taxSchemeList(ctx) {
    const taxSchemes = [
      { type: "法定代扣代缴", name: "养老保险", reference_code: "gross_salary", value: 8, suffix: "%" },
      { type: "法定代扣代缴", name: "医疗保险", reference_code: "gross_salary", value: 2, suffix: "%" },
      { type: "法定代扣代缴", name: "失业保险", reference_code: "gross_salary", value: 0.5, suffix: "%" },
      { type: "法定代扣代缴", name: "住房公积金", reference_code: "gross_salary", value: 5, suffix: "%" }
    ];
    ctx.body = taxSchemes;
  }
}

module.exports = RoleController;