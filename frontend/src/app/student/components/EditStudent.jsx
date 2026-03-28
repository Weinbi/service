import { useEffect, useRef } from 'react';
import axios from '@/utils/request';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { showAlert } from '@/components/Alert';

const EditStudent = ({ student, onUpdateSuccess }) => {
  const closeBtnRef = useRef(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      parent_phone: '',
      status: '新线索'
    }
  });

  useEffect(() => {
    if (student) {
      reset({
        name: student.name || '',
        parent_phone: student.parent_phone || '',
        status: student.status || '新线索',
      });
    }
  }, [student, reset]);

  const onSubmit = async (data) => {
    if (!student) return;
    try {
      await axios.put(`/api/students/${student.id}`, data);
      onUpdateSuccess();
      closeBtnRef.current?.click();
      showAlert('更新成功', 'success');
    } catch (error) {
      showAlert(error.response?.data?.message || '更新失败', 'warning');
    }
  };

  return (
    <div id="student-edit-modal" className="hs-overlay hidden size-full fixed top-0 start-0 z-80 overflow-x-hidden overflow-y-auto pointer-events-none">
      <div className="hs-overlay-animation-target hs-overlay-open:scale-100 hs-overlay-open:opacity-100 scale-95 opacity-0 ease-in-out transition-all duration-200 max-w-2xl lg:w-full m-3 mx-auto min-h-[calc(100%-56px)] flex items-center">
        <div className="w-full flex flex-col card border border-default-200 shadow-2xs rounded-xl pointer-events-auto bg-white">
          <div className="card-header flex justify-between items-center py-3 px-4 border-b">
            <h3 className="font-semibold text-base text-default-800">编辑学生信息</h3>
            <button type="button" ref={closeBtnRef} aria-label="Close" data-hs-overlay="#student-edit-modal">
              <X className="size-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="card-body p-4 overflow-y-auto" style={{ maxHeight: '70vh' }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-none">
                <div>
                  <label className="block mb-2 text-sm font-medium">学生姓名 <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-input w-full border rounded p-2"
                    {...register("name", { required: "姓名为必填项" })}
                  />
                  {errors.name && <span className="text-xs text-danger mt-1">{errors.name.message}</span>}
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium">家长电话 <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-input w-full border rounded p-2"
                    {...register("parent_phone", {
                      required: "家长电话为必填项",
                      pattern: { value: /^1[3-9]\d{9}$/, message: "请输入有效的手机号" }
                    })}
                  />
                  {errors.parent_phone && <span className="text-xs text-danger mt-1">{errors.parent_phone.message}</span>}
                </div>

              </div>
            </div>

            <div className="card-footer p-4 flex justify-end gap-2 border-t">
              <button type="button" className="btn bg-transparent text-danger" data-hs-overlay="#student-edit-modal">取消</button>
              <button type="submit" className="btn bg-primary text-white px-4 py-2 rounded">保存修改</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditStudent;