import { useRef } from 'react';
import axios from '@/utils/request';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { showAlert } from '@/components/Alert';

const AddRecord = ({ student, onAddSuccess }) => {
  const closeBtnRef = useRef(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { content: '' }
  });

  const onSubmit = async (data) => {
    if (!student) return;
    try {
      await axios.post(`/api/students/${student.id}/records`, data);
      onAddSuccess();
      reset();
      closeBtnRef.current?.click();
      showAlert('添加成功', 'success');
    } catch (error) {
      showAlert(error.response?.data?.message || '添加失败', 'warning');
    }
  };

  return (
    <div id="student-add-record-modal" className="hs-overlay hidden size-full fixed top-0 start-0 z-[90] overflow-x-hidden overflow-y-auto pointer-events-none">
      <div className="hs-overlay-animation-target hs-overlay-open:scale-100 hs-overlay-open:opacity-100 scale-95 opacity-0 ease-in-out transition-all duration-200 max-w-lg lg:w-full m-3 mx-auto min-h-[calc(100%-56px)] flex items-center">
        <div className="w-full flex flex-col card border border-default-200 shadow-2xl rounded-xl pointer-events-auto bg-white">

          <div className="card-header flex justify-between items-center py-3 px-4 border-b bg-default-50 rounded-t-xl">
            <h3 className="font-semibold text-base text-default-800">
              添加跟进动态 ({student?.name})
            </h3>
            <button type="button" ref={closeBtnRef} aria-label="Close" data-hs-overlay="#student-add-record-modal">
              <X className="size-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="card-body p-4">
              <div>
                <label className="block mb-2 text-sm font-medium">跟进内容 <span className="text-danger">*</span></label>
                <textarea
                  className="form-input w-full border rounded p-3"
                  rows="4"
                  placeholder="请输入本次跟进的详情、意向变化或沟通内容..."
                  {...register("content", { required: "跟进内容为必填项" })}
                ></textarea>
                {errors.content && <span className="text-xs text-danger mt-1">{errors.content.message}</span>}
              </div>
            </div>

            <div className="card-footer p-4 flex justify-end gap-2 border-t">
              <button type="button" className="btn bg-transparent text-danger" onClick={() => reset()} data-hs-overlay="#student-add-record-modal">取消</button>
              <button type="submit" className="btn bg-primary text-white px-4 py-2 rounded">确认保存</button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};

export default AddRecord;