import { useRef } from 'react';
import axios from '@/utils/request';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';

const AddStudent = ({ onAddSuccess }) => {
  const closeBtnRef = useRef(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: '', 
      parent_phone: '', 
      status: '新线索',
      initial_record: ''
    }
  });

  const onSubmit = async (data) => {
    try {
      await axios.post('/api/students', data);
      onAddSuccess(); 
      reset(); 
      closeBtnRef.current?.click(); 
    } catch (error) {
      alert('添加失败: ' + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div id="student-add-modal" className="hs-overlay hidden size-full fixed top-0 start-0 z-80 overflow-x-hidden overflow-y-auto pointer-events-none">
      <div className="hs-overlay-animation-target hs-overlay-open:scale-100 hs-overlay-open:opacity-100 scale-95 opacity-0 ease-in-out transition-all duration-200 max-w-2xl lg:w-full m-3 mx-auto min-h-[calc(100%-56px)] flex items-center">
        <div className="w-full flex flex-col card border border-default-200 shadow-2xs rounded-xl pointer-events-auto bg-white">
          <div className="card-header flex justify-between items-center py-3 px-4 border-b">
            <h3 className="font-semibold text-base text-default-800">添加新学生线索</h3>
            <button type="button" ref={closeBtnRef} aria-label="Close" data-hs-overlay="#student-add-modal">
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

                <div className="md:col-span-2">
                    <label className="block mb-2 text-sm font-medium">初次跟进记录</label>
                    <textarea
                        className="form-input w-full border rounded p-2"
                        rows="3"
                        placeholder="如：意向课程、来源渠道等..."
                        {...register("initial_record")}
                    ></textarea>
                </div>

              </div>
            </div>

            <div className="card-footer p-4 flex justify-end gap-2 border-t">
              <button type="button" className="btn bg-transparent text-danger" onClick={() => reset()} data-hs-overlay="#student-add-modal">取消</button>
              <button type="submit" className="btn bg-primary text-white px-4 py-2 rounded">确认添加</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddStudent;