import { Plus, SquarePen, Trash2, CircleCheck, CircleX } from 'lucide-react';

const ClassList = ({ classes, onSelectClass }) => {
  return (
    <div className="card">
      <div className="card-header flex justify-between items-center">
        <h6 className="card-title">班级列表 ({classes.length})</h6>
        <button 
          className="btn btn-sm bg-primary text-white flex items-center gap-1"
          data-hs-overlay="#class-add-modal"
        >
          <Plus className="size-4" /> 添加班级
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
                    <th className="px-3 py-3 font-medium text-start">班级名称</th>
                    <th className="px-3 py-3 font-medium text-start">课程名称</th>
                    <th className="px-3 py-3 font-medium text-start">所属校区</th>
                    <th className="px-3 py-3 font-medium text-start">教师</th>
                    <th className="px-3 py-3 font-medium text-start">容纳人数</th>
                    <th className="px-3 py-3 font-medium text-start">状态</th>
                    <th className="px-3 py-3 font-medium text-start">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-default-200">
                  {classes.length > 0 ? (
                    classes.map((cls) => (
                      <tr key={cls.id} className="text-default-800 font-normal whitespace-nowrap">
                        <td className="px-3 py-3 text-sm text-primary">#{cls.id}</td>
                        <td className="px-3 py-3 text-sm font-medium">{cls.class_name}</td>
                        <td className="px-3 py-3 text-sm">{cls.course_name || '-'}</td>
                        <td className="px-3 py-3 text-sm">{cls.campus_name || '-'}</td>
                        <td className="px-3 py-3 text-sm">{cls.teacher_name || '-'}</td>
                        <td className="px-3 py-3 text-sm">{cls.current_count} / {cls.max_capacity}</td>
                        <td className="px-3 py-3 text-sm">
                          {cls.status === '开课中' ? (
                            <span className="py-1 px-3 inline-flex items-center gap-x-1 text-xs font-medium bg-success/10 text-success rounded">
                              <CircleCheck className="size-3" /> 开课中
                            </span>
                          ) : (
                            <span className="py-1 px-3 inline-flex items-center gap-x-1 text-xs font-medium bg-default-200 text-default-600 rounded">
                              <CircleX className="size-3" /> 已结课
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              className="flex size-8 bg-default-200 rounded-md items-center justify-center hover:bg-primary/10 hover:text-primary transition-all text-default-600"
                              onClick={() => onSelectClass(cls)}
                              data-hs-overlay="#class-edit-modal"
                            >
                              <SquarePen className="size-4" />
                            </button>

                            <button
                              className="flex size-8 bg-default-200 rounded-md items-center justify-center hover:bg-danger/10 hover:text-danger transition-all text-default-600"
                              onClick={() => onSelectClass(cls)}
                              data-hs-overlay="#class-delete-modal"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="8" className="text-center py-4">暂无班级数据</td></tr>
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
export default ClassList;