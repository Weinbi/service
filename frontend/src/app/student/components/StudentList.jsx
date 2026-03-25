import { Plus, Eye, SquarePen, Trash2 } from 'lucide-react';
import defaultAvatar from '@/assets/images/user/avatar-default.png';

const StudentList = ({ students, onSelectStudent }) => {
  const renderStatusBadge = (status) => {
    if (status === '新线索') {
      // 灰色
      return (
        <span className="py-1 px-3 inline-flex items-center gap-x-1 text-xs font-medium bg-default-100 text-default-800 rounded">
          {status}
        </span>
      );
    } else if (status === '已试听') {
      // 蓝色 (info)
      return (
        <span className="py-1 px-3 inline-flex items-center gap-x-1 text-xs font-medium bg-info/10 text-info rounded">
          {status}
        </span>
      );
    } else if (status === '已转化') {
      // 绿色 (success)
      return (
        <span className="py-1 px-3 inline-flex items-center gap-x-1 text-xs font-medium bg-success/10 text-success rounded">
          {status}
        </span>
      );
    } else if (status === '已流失') {
      // 红色 (danger)
      return (
        <span className="py-1 px-3 inline-flex items-center gap-x-1 text-xs font-medium bg-danger/10 text-danger rounded">
          {status}
        </span>
      );
    } else {
      // 默认状态（容错）
      return (
        <span className="py-1 px-3 inline-flex items-center gap-x-1 text-xs font-medium bg-default-100 text-default-800 rounded">
          {status}
        </span>
      );
    }
  };

  return (
    <div className="card">
      <div className="card-header flex justify-between items-center">
        <h6 className="card-title">学生 ({students.length})</h6>
        <button
          className="btn btn-sm bg-primary text-white flex items-center gap-1"
          data-hs-overlay="#student-add-modal"
        >
          <Plus className="size-4" /> 添加学生
        </button>
      </div>

      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="min-w-full inline-block align-middle">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-default-200">
                <thead className="bg-default-100 font-normal whitespace-nowrap">
                  <tr className="text-sm text-default-800">
                    <th className="px-3 py-3 font-medium text-start">ID</th>
                    <th className="px-3 py-3 font-medium text-start">姓名</th>
                    <th className="px-3 py-3 font-medium text-start">家长电话</th>
                    <th className="px-3 py-3 font-medium text-start">状态</th>
                    <th className="px-3 py-3 font-medium text-start">课程顾问</th>
                    <th className="px-3 py-3 font-medium text-start">创建时间</th>
                    <th className="px-3 py-3 font-medium text-start">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-default-200">
                  {students.length > 0 ? (
                    students.map((student) => (
                      <tr key={student.id} className="text-default-800 font-normal whitespace-nowrap">
                        <td className="px-3 py-3 text-sm text-primary">#{student.id}</td>
                        <td className="px-3 py-3 text-sm">
                          <div className="flex gap-3 items-center">
                            <img src={defaultAvatar} alt={student.name} className="h-6 rounded-full" width={24} />
                            <h6 className="text-heading font-medium">{student.name}</h6>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-sm">{student.parent_phone || '-'}</td>
                        <td className="px-3 py-3 text-sm">
                          {renderStatusBadge(student.status)}
                        </td>
                        <td className="px-3 py-3 text-sm">{student.consultant_name || '-'}</td>
                        <td className="px-3 py-3 text-sm">
                          {student.created_at ? new Date(student.created_at).toLocaleDateString() : '-'}
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              className="flex size-8 bg-default-200 rounded-md items-center justify-center hover:bg-info/10 hover:text-info transition-all text-default-600"
                              onClick={() => onSelectStudent(student)}
                              data-hs-overlay="#student-details-modal"
                              title="查看详情"
                            >
                              <Eye className="size-4" />
                            </button>
                            <button
                              className="flex size-8 bg-default-200 rounded-md items-center justify-center hover:bg-primary/10 hover:text-primary transition-all text-default-600"
                              onClick={() => onSelectStudent(student)}
                              data-hs-overlay="#student-edit-modal"
                            >
                              <SquarePen className="size-4" />
                            </button>

                            <button
                              className="flex size-8 bg-default-200 rounded-md items-center justify-center hover:bg-danger/10 hover:text-danger transition-all text-default-600"
                              onClick={() => onSelectStudent(student)}
                              data-hs-overlay="#student-delete-modal"
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
export default StudentList;