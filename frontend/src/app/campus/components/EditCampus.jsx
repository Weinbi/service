import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import axios from '@/utils/request';
import { useEffect, useRef } from 'react';
import { showAlert } from '@/components/Alert';

const EditCampus = ({ campusData, onSuccess }) => {
  const closeBtnRef = useRef(null);
  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm();

  // 当传入的编辑数据变化时，更新表单
  useEffect(() => {
    if (campusData) {
      setValue('name', campusData.name);
      setValue('address', campusData.address);
      setValue('status', campusData.status);
    }
  }, [campusData, setValue]);

  const onSubmit = async (data) => {
    if (!campusData?.id) return;
    try {
      await axios.put(`/api/campuses/${campusData.id}`, data);
      onSuccess();
      closeBtnRef.current?.click();
      showAlert('更新成功', 'success');
    } catch (error) {
      showAlert(error.response?.data?.message || '更新失败', 'warning');
    }
  };

  return (
    <div id="campus-edit-modal" className="hs-overlay hidden size-full fixed top-0 start-0 z-80 overflow-x-hidden overflow-y-auto pointer-events-none" role="dialog" tabIndex={-1} aria-labelledby="campus-edit-modal-label">
      <div className="hs-overlay-animation-target hs-overlay-open:scale-100 hs-overlay-open:opacity-100 scale-95 opacity-0 ease-in-out transition-all duration-200 sm:max-w-lg sm:w-full m-3 sm:mx-auto min-h-[calc(100%-56px)] flex items-center">
        <div className="w-full flex flex-col card border border-default-200 shadow-2xs rounded-xl pointer-events-auto">
          <div className="card-header flex justify-between items-center py-3 px-4 border-b border-default-200">
            <h3 id="campus-edit-modal-label" className="font-bold text-default-800 text-base">
              编辑校区信息
            </h3>
            <button type="button" ref={closeBtnRef} className="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200" aria-label="Close" data-hs-overlay="#campus-edit-modal">
              <span className="sr-only">Close</span>
              <X className="size-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="p-4 overflow-y-auto">
              <div className="flex flex-col gap-y-4">
                <div className="lg:col-span-12">
                  <label htmlFor="edit_name" className="inline-block mb-2 text-base font-medium">校区名称</label>
                  <input
                    type="text"
                    id="edit_name"
                    className="form-input"
                    {...register("name", { required: "校区名称必填" })}
                  />
                  {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
                </div>

                <div className="lg:col-span-12">
                  <label htmlFor="edit_address" className="inline-block mb-2 text-base font-medium">地址</label>
                  <input
                    type="text"
                    id="edit_address"
                    className="form-input"
                    {...register("address")}
                  />
                </div>

                <div className="lg:col-span-12">
                  <label htmlFor="edit_status" className="inline-block mb-2 text-sm text-default-800 font-medium">状态</label>
                  <select id="edit_status" className="form-input" {...register("status")}>
                    <option value="营业中">营业中</option>
                    <option value="已停业">已停业</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="card-footer flex justify-end items-center gap-x-2 py-3 px-4">
              <button type="button" data-hs-overlay="#campus-edit-modal" className="btn bg-transparent text-danger border border-transparent hover:bg-danger/10">
                取消
              </button>
              <button type="submit" className="btn bg-primary text-white" disabled={isSubmitting}>
                {isSubmitting ? '保存中...' : '保存修改'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default EditCampus;