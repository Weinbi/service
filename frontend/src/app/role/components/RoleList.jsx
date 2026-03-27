// frontend/src/app/role/components/RoleList.jsx
import { Plus, SquarePen, Trash2 } from 'lucide-react';

const RoleList = ({ roles, onSelectRole }) => {
  return (
    <div className="card">
      <div className="card-header flex justify-between items-center">
        <h6 className="card-title">系统角色 ({roles?.length || 0})</h6>
        <button 
          className="btn btn-sm bg-primary text-white flex items-center gap-1"
          data-hs-overlay="#role-add-modal"
        >
          <Plus className="size-4" /> 添加角色
        </button>
      </div>

      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="min-w-full inline-block align-middle">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-default-200">
                <thead className="bg-default-100 font-normal whitespace-nowrap">
                  <tr className="text-sm text-default-800">
                    <th className="px-3.5 py-3 font-medium text-start">ID</th>
                    <th className="px-3.5 py-3 font-medium text-start">角色名称</th>
                    <th className="px-3.5 py-3 font-medium text-start">角色描述</th>
                    <th className="px-3.5 py-3 font-medium text-start">创建时间</th>
                    <th className="px-3.5 py-3 font-medium text-start">更新时间</th>
                    <th className="px-3.5 py-3 font-medium text-start">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-default-200">
                  {roles?.map(role => (
                    <tr key={role.id} className="text-default-800 font-normal whitespace-nowrap">
                      <td className="px-3.5 py-3 text-sm">{role.id}</td>
                      <td className="px-3.5 py-3 text-sm text-primary font-medium">{role.role_name}</td>
                      <td className="px-3.5 py-3 text-sm">{role.role_description || '-'}</td>
                      <td className="px-3.5 py-3 text-sm">{new Date(role.created_at).toLocaleString()}</td>
                      <td className="px-3.5 py-3 text-sm">{new Date(role.updated_at).toLocaleString()}</td>
                      <td className="px-3.5 py-3">
                        <div className="flex items-center gap-2">
                          <button 
                            className="flex size-8 bg-default-200 rounded-md items-center justify-center hover:bg-primary/10 hover:text-primary transition-all text-default-600"
                            onClick={() => onSelectRole(role)}
                            data-hs-overlay="#role-edit-modal"
                          >
                            <SquarePen className="size-4" />
                          </button>
                          <button 
                            className="flex size-8 bg-default-200 rounded-md items-center justify-center hover:bg-primary/10 hover:text-danger transition-all text-default-600 text-danger"
                            onClick={() => onSelectRole(role)}
                            data-hs-overlay="#role-delete-modal"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {(!roles || roles.length === 0) && (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-default-500">暂无数据</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleList;