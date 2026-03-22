const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/config');

class AuthController {

  static async register(ctx) {
    const { real_name, phone, username, password } = ctx.request.body;

    // 参数校验拦截
    if (!real_name || !phone || !username || !password) {
      ctx.status = 400;
      ctx.body = { message: '参数错误: 姓名, 电话, 用户名 和 密码 必填' };
      return;
    }

    try {
      // 检查用户是否已存在
      const existing = await userModel.findByUsername(username);
      if (existing) {
        ctx.status = 409;
        ctx.body = { message: '用户已存在' };
        return;
      }

      // 密码加密
      const passwordHash = await bcrypt.hash(password, 12);

      // 修复：模型层 create 方法要求传入一个对象
      const userId = await userModel.create({
        username,
        passwordHash,
        real_name,
        phone,
        status: 1 // 默认启用状态
      });

      ctx.status = 201;
      ctx.body = { message: '注册成功', userId };
    } catch (err) {
      ctx.status = 500;
      ctx.body = { error: '注册失败', message: err.message };
    }
  }

  static async login(ctx) {
    const { username, password } = ctx.request.body;

    if (!username || !password) {
      ctx.status = 400;
      ctx.body = { message: '请输入用户名和密码' };
      return;
    }
    try {
      const user = await userModel.findByUsername(username);
      if (!user || !(await bcrypt.compare(password, user.password))) {
        ctx.status = 401;
        ctx.body = { message: '用户名或密码错误' };
        return;
      }

      if (user.status === 0) {
        ctx.status = 401;
        ctx.body = { message: '用户已被禁用' };
        return;
      }

      // 获取用户详细信息 (包含 real_name 和 role_name)
      const userDetail = await userModel.findById(user.id);

      // 获取用户权限 (RBAC 核心)
      const permissions = await userModel.findPermissionsByUserId(user.id);

      // === 签发 JWT ===
      const token = jwt.sign(
        { id: user.id, username: user.username, real_name: userDetail.real_name },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );
      ctx.status = 200;
      ctx.body = {
        message: '登录成功',
        token, // 前端需保存此 Token
        userInfo: {
          id: user.id,
          username: user.username,
          real_name: userDetail.real_name, // 添加真实姓名
          role_name: userDetail.role_name  // 添加角色名称
        },
        permissions: permissions
      };
    } catch (err) {
      console.error(err);
      ctx.status = 500;
      ctx.body = { message: '服务器错误' };
    }
  }
}

module.exports = AuthController;