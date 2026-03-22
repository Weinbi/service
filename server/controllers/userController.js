const UserModel = require('../models/userModel');
const bcrypt = require('bcryptjs');

class UserController {
  // 获取列表
  static async list(ctx) {
    try {
      const users = await UserModel.findAll();
      ctx.body = users;
    } catch (err) {
      ctx.status = 500;
      ctx.body = { message: '获取用户列表失败' };
    }
  }

  static async detail(ctx) {
    try {
      const userId = ctx.params.id;
      // 假设你的 UserModel 中有 findById 方法
      const user = await UserModel.findById(userId);

      if (!user) {
        ctx.status = 404;
        ctx.body = { message: '用户不存在' };
        return;
      }

      // 安全起见，剔除密码字段，返回其他基本信息（如 real_name）
      const { password, ...safeUserInfo } = user;
      ctx.body = safeUserInfo;

    } catch (err) {
      console.error(err);
      ctx.status = 500;
      ctx.body = { message: '获取用户信息失败: ' + err.message };
    }
  }

  static async add(ctx) {
    try {
      const data = ctx.request.body;

      // 检查用户名是否已存在
      const existUser = await UserModel.findByUsername(data.username);
      if (existUser) {
        ctx.status = 400;
        ctx.body = { message: '用户名已存在' };
        return;
      }

      // 密码加密
      const hash = await bcrypt.hash(data.password, 12);
      data.passwordHash = hash;

      const insertId = await UserModel.create(data);
      ctx.body = { message: '添加成功', id: insertId };
    } catch (err) {
      console.error(err);
      ctx.status = 500;
      ctx.body = { message: '添加用户失败: ' + err.message };
    }
  }

  // 更新用户
  static async update(ctx) {
    try {
      const success = await UserModel.update(ctx.params.id, ctx.request.body);
      if (success) {
        ctx.body = { message: '更新成功' };
      } else {
        ctx.status = 400;
        ctx.body = { message: '更新失败' };
      }
    } catch (err) {
      ctx.status = 500;
      ctx.body = { message: err.message };
    }
  }

  // 删除用户
  static async remove(ctx) {
    try {
      const success = await UserModel.delete(ctx.params.id);
      if (success) {
        ctx.body = { message: '删除成功' };
      } else {
        ctx.status = 400;
        ctx.body = { message: '删除失败' };
      }
    } catch (err) {
      ctx.status = 500;
      ctx.body = { message: err.message };
    }
  }

  // 修改密码
  static async changePassword(ctx) {
    const { oldPassword, newPassword } = ctx.request.body;

    // 从鉴权中间件解析的 token 中获取 userId (通常在 ctx.state.user 或 ctx.user)
    // 假设你的 authMiddleware 将解码后的用户信息挂载在 ctx.state.user
    const userId = ctx.state.user.id;

    if (!oldPassword || !newPassword) {
      ctx.status = 400;
      ctx.body = { message: '请输入旧密码和新密码' };
      return;
    }

    try {
      // 1. 获取用户信息（包含加密后的密码）
      const user = await UserModel.findByIdWithPassword(userId);
      if (!user) {
        ctx.status = 404;
        ctx.body = { message: '用户不存在' };
        return;
      }

      // 2. 验证旧密码是否正确
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        ctx.status = 400;
        ctx.body = { message: '旧密码不正确' };
        return;
      }

      // 3. 对新密码进行哈希加密
      const hash = await bcrypt.hash(newPassword, 12);

      // 4. 更新数据库
      const success = await UserModel.updatePassword(userId, hash);
      if (success) {
        ctx.body = { message: '密码修改成功' };
      } else {
        ctx.status = 500;
        ctx.body = { message: '密码更新失败' };
      }

    } catch (err) {
      console.error('修改密码错误:', err);
      ctx.status = 500;
      ctx.body = { message: '服务器内部错误' };
    }
  }

  static async getProfile(ctx) {
    try {
      const userId = ctx.state.user.id;
      const user = await UserModel.findById(userId);
      if (!user) {
        ctx.status = 404;
        ctx.body = { message: '用户不存在' };
        return;
      }
      const { password, ...safeUserInfo } = user;
      ctx.body = safeUserInfo;
    } catch (err) {
      ctx.status = 500;
      ctx.body = { message: '获取用户信息失败: ' + err.message };
    }
  }

  // 更新当前用户的个人资料
  static async updateProfile(ctx) {
    try {
      const userId = ctx.state.user.id;
      const { real_name, phone } = ctx.request.body;

      const success = await UserModel.update(userId, { real_name, phone });
      if (success) {
        ctx.body = { message: '个人资料更新成功' };
      } else {
        ctx.status = 400;
        ctx.body = { message: '更新失败' };
      }
    } catch (err) {
      ctx.status = 500;
      ctx.body = { message: err.message };
    }
  }
}

module.exports = UserController;