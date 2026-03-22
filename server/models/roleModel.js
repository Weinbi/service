// server/models/roleModel.js
const db = require('../config/db');

class RoleModel {
  static async findAll() {
    return await db('roles').orderBy('id', 'desc');
  }

  static async findById(id) {
    return await db('roles').where({ id }).first();
  }

  static async checkUserDependency(roleId) {
    const user = await db('users').where({ role_id: roleId }).select('id').first();
    return !!user;
  }

  static async create(roleData) {
    const { role_name, role_description, permissions = [], salary_scheme = [], tax_scheme = [] } = roleData;
    const [insertId] = await db('roles').insert({
      role_name,
      role_description,
      permissions: JSON.stringify(permissions),
      salary_scheme: JSON.stringify(salary_scheme),
      tax_scheme: JSON.stringify(tax_scheme),
    });
    return insertId;
  }

  static async update(id, roleData) {
    const { role_name, role_description, permissions = [], salary_scheme = [], tax_scheme = [] } = roleData;
    const affectedRows = await db('roles')
      .where({ id })
      .update({
        role_name,
        role_description,
        permissions: JSON.stringify(permissions),
        salary_scheme: JSON.stringify(salary_scheme),
        tax_scheme: JSON.stringify(tax_scheme)
      });
    return affectedRows;
  }

  static async delete(id) {
    const affectedRows = await db('roles').where({ id }).del();
    return affectedRows;
  }
}

module.exports = RoleModel;