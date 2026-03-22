const UserModel = require('../models/userModel');

// 接收参数：requiredPermission (例如 'user:delete')
const checkPermission = (requiredPermission) => {
  return async (ctx, next) => {
    const userId = ctx.state.user.id; // 从 auth 中间件获取

    try {
      // 1. 查询该用户拥有的所有权限
      // 优化提示：生产环境中，这里应该使用 Redis 缓存权限列表，避免频繁查库
      const userPermissions = await UserModel.findPermissionsByUserId(userId);

      // 2. 检查是否包含所需权限
      if (userPermissions.includes(requiredPermission)) {
        await next(); // 权限匹配，放行
      } else {
        ctx.status = 403; // Forbidden
        ctx.body = { error: `权限不足：需要 [${requiredPermission}]` };
      }
    } catch (err) {
      console.error(err);
      ctx.status = 500;
      ctx.body = { error: '权限验证服务错误' };
    }
  };
};

module.exports = checkPermission;