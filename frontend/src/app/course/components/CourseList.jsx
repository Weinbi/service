import { Plus, Pencil, Trash2 } from 'lucide-react';

const CourseList = ({ courses, onSelectCourse }) => {
  return (<div className="card">
    <div className="card-header flex justify-between items-center">
      <h6 className="card-title">课程列表</h6>
      <button className="btn btn-sm bg-primary text-white flex items-center gap-1" data-hs-overlay="#course-add-modal">
        <Plus className="size-4" /> 添加课程
      </button>
    </div>

    <div className="flex flex-col">
      <div className="overflow-x-auto">
        <div className="min-w-full inline-block align-middle">
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-default-200">
              <thead className="font-semibold whitespace-nowrap">
                <tr className="text-sm text-default-800 divide-x divide-default-200">
                  <th className="px-3 py-3 text-start">课程名称</th>
                  <th className="px-3 py-3 text-start">每节时长(分钟)</th>
                  <th className="px-3 py-3 text-start">标准单价(元)</th>
                  <th className="px-3 py-3 text-start">更新时间</th>
                  <th className="px-3 py-3 text-center">操作</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-default-200">
                {courses.length > 0 ? (
                  courses.map((item) => (
                    <tr key={item.id} className="text-default-800 font-normal whitespace-nowrap divide-x divide-default-200 hover:bg-default-50 transition-colors">
                      <td className="px-3 py-3 text-sm font-medium">{item.course_name}</td>
                      <td className="px-3 py-3 text-sm">{item.class_period} 分钟</td>
                      <td className="px-3 py-3 text-sm text-primary font-medium">¥{item.unit_price}</td>
                      <td className="px-3 py-3 text-sm">{item.updated_at}</td>
                      <td className="px-3 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            className="btn size-8 bg-default-200 hover:bg-primary/10 hover:text-primary text-default-600 flex items-center justify-center rounded-md transition-all"
                            aria-haspopup="dialog"
                            aria-expanded="false"
                            aria-controls="course-edit-modal"
                            data-hs-overlay="#course-edit-modal"
                            onClick={() => onSelectCourse(item)}
                          >
                            <Pencil className="size-4" />
                          </button>

                          <button
                            type="button"
                            className="btn size-8 bg-default-200 hover:bg-danger/10 hover:text-danger text-default-600 flex items-center justify-center rounded-md transition-all"
                            aria-haspopup="dialog"
                            aria-expanded="false"
                            aria-controls="course-delete-modal"
                            data-hs-overlay="#course-delete-modal"
                            onClick={() => onSelectCourse(item)}
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-3 py-6 text-center text-default-500">
                      暂无课程数据
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>);
};

export default CourseList;