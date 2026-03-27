import { useEffect, useRef } from 'react';
import axios from '@/utils/request';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';

const EditTextbook = ({ textbook, onUpdateSuccess }) => {
  const closeBtnRef = useRef(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { book_name: '', unit_price: '' }
  });

  useEffect(() => {
    if (textbook) {
      reset({
        book_name: textbook.book_name || '',
        unit_price: textbook.unit_price || ''
      });
    }
  }, [textbook, reset]);

  const onSubmit = async (data) => {
    if (!textbook) return;
    try {
      await axios.put(`/api/textbooks/${textbook.id}`, data);
      onUpdateSuccess();
      closeBtnRef.current?.click(); 
    } catch (error) {
      alert('更新失败: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div id="textbook-edit-modal" className="hs-overlay hidden size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto pointer-events-none">
      <div className="hs-overlay-animation-target hs-overlay-open:scale-100 hs-overlay-open:opacity-100 scale-95 opacity-0 ease-in-out transition-all duration-200 max-w-lg lg:w-full m-3 mx-auto min-h-[calc(100%-56px)] flex items-center">
        <div className="w-full flex flex-col card border border-default-200 shadow-2xs rounded-xl pointer-events-auto bg-white">
          <div className="card-header flex justify-between items-center py-3 px-4 border-b">
            <h3 className="font-semibold text-base text-default-800">编辑教材信息</h3>
            <button type="button" ref={closeBtnRef} aria-label="Close" data-hs-overlay="#textbook-edit-modal">
              <X className="size-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="card-body p-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium">书名 <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-input w-full border rounded p-2"
                    {...register("book_name", { required: "书名为必填项" })}
                  />
                  {errors.book_name && <span className="text-xs text-danger mt-1 block">{errors.book_name.message}</span>}
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium">标准单价 <span className="text-danger">*</span></label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="form-input w-full border rounded p-2"
                    {...register("unit_price", { required: "单价为必填项", min: { value: 0, message: "单价不能小于0" } })}
                  />
                  {errors.unit_price && <span className="text-xs text-danger mt-1 block">{errors.unit_price.message}</span>}
                </div>
                
                <p className="text-xs text-default-500">注：库存变动请通过业务操作(入库/发放)进行，在此不可直接修改。</p>
              </div>
            </div>

            <div className="card-footer p-4 flex justify-end gap-2 border-t">
              <button type="button" className="btn bg-transparent text-danger px-4 py-2" data-hs-overlay="#textbook-edit-modal">取消</button>
              <button type="submit" className="btn bg-primary text-white px-4 py-2 rounded">保存修改</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditTextbook;