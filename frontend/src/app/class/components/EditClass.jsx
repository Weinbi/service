import { useState, useEffect, useRef } from 'react';
import axios from '@/utils/request';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { showAlert } from '@/components/Alert';

const EditClass = ({ classItem, onUpdateSuccess }) => {
  const closeBtnRef = useRef(null);

  const [courses, setCourses] = useState([]);
  const [campuses, setCampuses] = useState([]);
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [courseRes, campusRes, userRes] = await Promise.all([
          axios.get('/api/courses'),
          axios.get('/api/campuses'),
          axios.get('/api/users')
        ]);
        setCourses(courseRes.data);
        setCampuses(campusRes.data);
        setTeachers(userRes.data);
      } catch (error) {
        console.error('无法获取下拉选项', error);
      }
    };
    fetchOptions();
  }, []);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      class_name: '', course_id: '', campus_id: '', teacher_id: '',
      max_capacity: '', status: '开课中'
    }
  });

  // 加载所选班级数据
  useEffect(() => {
    if (classItem) {
      reset({
        class_name: classItem.class_name || '',
        course_id: classItem.course_id || '',
        campus_id: classItem.campus_id || '',
        teacher_id: classItem.teacher_id || '',
        max_capacity: classItem.max_capacity || 0,
        status: classItem.status || '开课中'
      });
    }
  }, [classItem, reset]);

  const onSubmit = async (data) => {
    if (!classItem) return;
    try {
      await axios.put(`/api/classes/${classItem.id}`, data);
      onUpdateSuccess();
      closeBtnRef.current?.click();
      showAlert('更新成功', 'success');
    } catch (error) {
      showAlert(error.response?.data?.message || '更新失败', 'warning');
    }
  };

  return (
    <div id="class-edit-modal" className="hs-overlay hidden size-full fixed top-0 start-0 z-80 overflow-x-hidden overflow-y-auto pointer-events-none">
      <div className="hs-overlay-animation-target hs-overlay-open:scale-100 hs-overlay-open:opacity-100 scale-95 opacity-0 ease-in-out transition-all duration-200 max-w-2xl lg:w-full m-3 mx-auto min-h-[calc(100%-56px)] flex items-center">
        <div className="w-full flex flex-col card border border-default-200 shadow-2xs rounded-xl pointer-events-auto bg-white">
          <div className="card-header flex justify-between items-center py-3 px-4 border-b">
            <h3 className="font-semibold text-base text-default-800">编辑班级信息</h3>
            <button type="button" ref={closeBtnRef} aria-label="Close" data-hs-overlay="#class-edit-modal">
              <X className="size-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="card-body p-4 overflow-y-auto" style={{ maxHeight: '70vh' }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-none">
                <div>
                  <label className="block mb-2 text-sm font-medium">班级名称 <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-input w-full border rounded p-2"
                    {...register("class_name", { required: "班级名称为必填项" })}
                  />
                  {errors.class_name && <span className="text-xs text-danger mt-1">{errors.class_name.message}</span>}
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium">所属课程 <span className="text-danger">*</span></label>
                  <select
                    className="form-input w-full border rounded p-2"
                    {...register("course_id", { required: "必须选择课程", valueAsNumber: true })}
                  >
                    <option value="">-- 请选择课程 --</option>
                    {courses.map(item => (
                      <option key={item.id} value={item.id}>{item.course_name}</option>
                    ))}
                  </select>
                  {errors.course_id && <span className="text-xs text-danger mt-1">{errors.course_id.message}</span>}
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium">所属校区 <span className="text-danger">*</span></label>
                  <select
                    className="form-input w-full border rounded p-2"
                    {...register("campus_id", { required: "必须选择校区", valueAsNumber: true })}
                  >
                    <option value="">-- 请选择校区 --</option>
                    {campuses.map(item => (
                      <option key={item.id} value={item.id}>{item.name}</option>
                    ))}
                  </select>
                  {errors.campus_id && <span className="text-xs text-danger mt-1">{errors.campus_id.message}</span>}
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium">授课教师 <span className="text-danger">*</span></label>
                  <select
                    className="form-input w-full border rounded p-2"
                    {...register("teacher_id", { required: "必须选择教师", valueAsNumber: true })}
                  >
                    <option value="">-- 请选择教师 --</option>
                    {teachers.map(item => (
                      <option key={item.id} value={item.id}>{item.real_name}</option>
                    ))}
                  </select>
                  {errors.teacher_id && <span className="text-xs text-danger mt-1">{errors.teacher_id.message}</span>}
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium">最大容纳人数 <span className="text-danger">*</span></label>
                  <input
                    type="number"
                    className="form-input w-full border rounded p-2"
                    {...register("max_capacity", {
                      required: "必须填写人数",
                      min: { value: 1, message: "最少为1人" },
                      valueAsNumber: true
                    })}
                  />
                  {errors.max_capacity && <span className="text-xs text-danger mt-1">{errors.max_capacity.message}</span>}
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium">状态</label>
                  <select
                    className="form-input w-full border rounded p-2"
                    {...register("status")}
                  >
                    <option value="开课中">开课中</option>
                    <option value="已结课">已结课</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="card-footer p-4 flex justify-end gap-2 border-t">
              <button type="button" className="btn bg-transparent text-danger" data-hs-overlay="#class-edit-modal">取消</button>
              <button type="submit" className="btn bg-primary text-white px-4 py-2 rounded">保存修改</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditClass;