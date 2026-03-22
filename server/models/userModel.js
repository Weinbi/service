// server/models/userModel.js
const db = require('../config/db');

class UserModel {
  // 根据用户名查找用户
  static async findByUsername(username) {
    return await db('users').where({ username }).first();
  }

  // 创建用户 (已更新字段)
  static async create(data) {
    const { username, passwordHash, real_name, phone, bank_name, bank_account, role_id, status, join_date, resignation_date } = data;

    const [insertId] = await db('users').insert({
      username,
      password: passwordHash,
      real_name: real_name || null,
      phone: phone || null,
      bank_name: bank_name || null,
      bank_account: bank_account || null,
      role_id: role_id || null,
      status: status ?? 1,
      join_date: join_date || null,
      resignation_date: resignation_date || null
    });

    return insertId;
  }

  // 获取用户的权限列表 (核心 RBAC 方法)
  static async findPermissionsByUserId(userId) {
    const row = await db('users as u')
      .leftJoin('roles as r', 'u.role_id', 'r.id')
      .where('u.id', userId)
      .select('r.permissions')
      .first();

    if (row && row.permissions) {
      return row.permissions;
    }
    return [];
  }

  // 获取用户列表 (补充需要的字段)
  static async findAll() {
    return await db('users as u')
      .leftJoin('roles as r', 'u.role_id', 'r.id')
      .select(
        'u.id', 'u.username', 'u.real_name', 'u.phone', 'u.bank_name',
        'u.bank_account', 'u.status', 'u.join_date', 'u.resignation_date', 'u.created_at',
        'r.role_name', 'r.id as role_id'
      )
      .orderBy([
        { column: 'u.status', order: 'desc' },
        { column: 'u.created_at', order: 'desc' }
      ]);
  }

  // 根据ID获取单个用户
  static async findById(id) {
    return await db('users as u')
      .leftJoin('roles as r', 'u.role_id', 'r.id')
      .where('u.id', id)
      .select(
        'u.id', 'u.username', 'u.real_name', 'u.phone', 'u.status',
        'u.join_date', 'u.resignation_date', 'r.role_name'
      )
      .first();
  }

  // 根据ID查找用户（包含密码字段，专用于密码修改验证）
  static async findByIdWithPassword(id) {
    return await db('users').where({ id }).first();
  }

  // 更新密码
  static async updatePassword(id, passwordHash) {
    const affectedRows = await db('users')
      .where({ id })
      .update({ password: passwordHash });
    return affectedRows > 0;
  }

  // 更新用户信息 
  static async update(id, data) {
    const updateData = {};

    // 只挑选 data 中存在的字段进行更新，避免覆盖其他字段
    if (data.real_name !== undefined) updateData.real_name = data.real_name;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.bank_name !== undefined) updateData.bank_name = data.bank_name;
    if (data.bank_account !== undefined) updateData.bank_account = data.bank_account;
    if (data.role_id !== undefined) updateData.role_id = data.role_id;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.join_date !== undefined) updateData.join_date = data.join_date;
    if (data.resignation_date !== undefined) updateData.resignation_date = data.resignation_date;
    if (data.avatar_url !== undefined) updateData.avatar_url = data.avatar_url;

    // 如果没有任何需要更新的字段，直接返回成功
    if (Object.keys(updateData).length === 0) return true;

    const affectedRows = await db('users')
      .where({ id })
      .update(updateData);

    return affectedRows > 0;
  }

  // 软删除用户 (设置状态为0)
  static async delete(id) {
    const affectedRows = await db('users')
      .where({ id })
      .update({ status: 0 });
    return affectedRows > 0;
  }
}

module.exports = UserModel;