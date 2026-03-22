import { Plus, SquarePen, Trash2, CircleCheck, CircleX } from 'lucide-react';
import defaultAvatar from '@/assets/images/user/avatar-default.png';

const UserList = ({ users, onSelectUser }) => {
  return (
    <div className="card">
      <div className="card-header flex justify-between items-center">
        <h6 className="card-title">用户 ({users.length})</h6>

        <button 
          className="btn btn-sm bg-primary text-white flex items-center gap-1"
          data-hs-overlay="#user-add-modal"
        >
          <Plus className="size-4" /> 添加用户
        </button>
      </div>

      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="min-w-full inline-block align-middle">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-default-200">
                <thead className="bg-default-100 font-normal whitespace-nowrap">
                  <tr className="text-sm text-default-800">
                    <th className="px-3 py-3 font-medium text-start">用户 ID</th>
                    <th className="px-3 py-3 font-medium text-start">姓名</th>
                    <th className="px-3 py-3 font-medium text-start">职位</th>
                    <th className="px-3 py-3 font-medium text-start">电话号码</th>
                    <th className="px-3 py-3 font-medium text-start">入职日期</th>
                    <th className="px-3 py-3 font-medium text-start">状态</th>
                    <th className="px-3 py-3 font-medium text-start">动作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-default-200">
                  {users.length > 0 ? (
                    users.map((user) => (
                      <tr key={user.id} className="text-default-800 font-normal whitespace-nowrap">
                        <td className="px-3 py-3 text-sm text-primary">#{user.id}</td>
                        <td className="px-3 py-3 text-sm">
                          <div className="flex gap-3 items-center">
                            <img src={defaultAvatar} alt={user.real_name} className="h-6 rounded-full" width={24} />
                            <h6 className="text-heading font-medium">{user.real_name}</h6>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-sm">{user.role_name || '-'}</td>
                        <td className="px-3 py-3 text-sm">{user.phone || '-'}</td>
                        <td className="px-3 py-3 text-sm">
                          {user.join_date ? new Date(user.join_date).toLocaleDateString() : '-'}
                        </td>
                        <td className="px-3 py-3 text-sm">
                          {user.status === 1 ? (
                            <span className="py-1 px-3 inline-flex items-center gap-x-1 text-xs font-medium bg-success/10 text-success rounded">
                              <CircleCheck className="size-3" /> 在职
                            </span>
                          ) : (
                            <span className="py-1 px-3 inline-flex items-center gap-x-1 text-xs font-medium bg-danger/10 text-danger rounded">
                              <CircleX className="size-3" /> 离职
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2">

                            <button
                              className="flex size-8 bg-default-200 rounded-md items-center justify-center hover:bg-primary/10 hover:text-primary transition-all text-default-600"
                              onClick={() => onSelectUser(user)}
                              data-hs-overlay="#user-edit-modal"
                            >
                              <SquarePen className="size-4" />
                            </button>

                            <button
                              className="flex size-8 bg-default-200 rounded-md items-center justify-center hover:bg-danger/10 hover:text-danger transition-all text-default-600"
                              onClick={() => onSelectUser(user)}
                              data-hs-overlay="#user-delete-modal"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="7" className="text-center py-4">暂无数据</td></tr>
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
export default UserList;