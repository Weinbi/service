import { useState, useEffect, useRef } from 'react';
import axios from '@/utils/request';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';

const AddTextbook = ({ onAddSuccess }) => {
  const closeBtnRef = useRef(null);
  const [campuses, setCampuses] = useState([]);

  useEffect(() => {
    const fetchCampuses = async () => {
      try {
        const res = await axios.get('/api/campuses');
        setCampuses(res.data);
      } catch (error) {
        console.error('无法获取校区列表', error);
      }
    };
    fetchCampuses();
  }, []);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      book_name: '',
      stock: '',
      unit_price: '',
      campus_id: ''
    }
  });

  const onSubmit = async (data) => {
    try {
      await axios.post('/api/textbooks', data);
      onAddSuccess(); 
      reset(); 
      closeBtnRef.current?.click(); 
    } catch (error) {
      alert('添加教材失败: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div id="textbook-add-modal" className="hs-overlay hidden size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto pointer-events-none">
      <div className="hs-overlay-animation-target hs-overlay-open:scale-100 hs-overlay-open:opacity-100 scale-95 opacity-0 ease-in-out transition-all duration-200 max-w-lg lg:w-full m-3 mx-auto min-h-[calc(100%-56px)] flex items-center">
        <div className="w-full flex flex-col card border border-default-200 shadow-2xs rounded-xl pointer-events-auto bg-white">
          <div className="card-header flex justify-between items-center py-3 px-4 border-b">
            <h3 className="font-semibold text-base text-default-800">入库新教材</h3>
            <button type="button" ref={closeBtnRef} aria-label="Close" data-hs-overlay="#textbook-add-modal">
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
                  <label className="block mb-2 text-sm font-medium">初始库存量 <span className="text-danger">*</span></label>
                  <input
                    type="number"
                    min="0"
                    className="form-input w-full border rounded p-2"
                    {...register("stock", { required: "库存为必填项", min: { value: 0, message: "库存不能小于0" } })}
                  />
                  {errors.stock && <span className="text-xs text-danger mt-1 block">{errors.stock.message}</span>}
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

                <div>
                  <label className="block mb-2 text-sm font-medium">所属校区 <span className="text-danger">*</span></label>
                  <select
                    className="form-input w-full border rounded p-2"
                    {...register("campus_id", { required: "请选择所属校区" })}
                  >
                    <option value="">-- 请选择校区 --</option>
                    {campuses.map(campus => (
                      <option key={campus.id} value={campus.id}>
                        {campus.name}
                      </option>
                    ))}
                  </select>
                  {errors.campus_id && <span className="text-xs text-danger mt-1 block">{errors.campus_id.message}</span>}
                </div>
              </div>
            </div>

            <div className="card-footer p-4 flex justify-end gap-2 border-t">
              <button type="button" className="btn bg-transparent text-danger px-4 py-2" onClick={() => reset()} data-hs-overlay="#textbook-add-modal">取消</button>
              <button type="submit" className="btn bg-primary text-white px-4 py-2 rounded">确认入库</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTextbook;