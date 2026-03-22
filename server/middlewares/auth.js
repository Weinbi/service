const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config');

module.exports = async (ctx, next) => {
  // 1. 获取 Authorization header (格式: Bearer <token>)
  const authHeader = ctx.request.headers.authorization;
  if (!authHeader) {
    ctx.status = 401;
    ctx.body = { error: '未提供认证 Token' };
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    // 2. 验证 Token
    const decoded = jwt.verify(token, JWT_SECRET);
    // 3. 将用户信息存入 context，供后续使用
    ctx.state.user = decoded; 
    await next();
  } catch (err) {
    ctx.status = 401;
    ctx.body = { error: 'Token 无效或已过期' };
  }
};