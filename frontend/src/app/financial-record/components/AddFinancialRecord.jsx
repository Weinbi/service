import { useState, useEffect, useRef } from 'react';
import axios from '@/utils/request';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';

const AddFinancialRecord = ({ onAddSuccess }) => {
  const closeBtnRef = useRef(null);
  const [campuses, setCampuses] = useState([]);

  useEffect(() => {
    // 拉取校区作为 select 选项
    const fetchCampuses = async () => {
      try {
        const res = await axios.get('/api/campuses');
        setCampuses(res.data);
      } catch (error) {
        console.error('无法获取校区选项', error);
      }
    };
    fetchCampuses();
  }, []);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      campus_id: '', trade_type: '', category: '', amount: '', remark: ''
    }
  });

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        serial_no: `FR${Date.now()}${Math.floor(Math.random() * 1000)}` // 自动生成 serial_no
      };
      await axios.post('/api/financialRecords', payload);
      onAddSuccess();
      reset();
      closeBtnRef.current?.click();
    } catch (error) {
      alert('添加失败: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div id="financial-record-add-modal" className="hs-overlay hidden size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto pointer-events-none">
      <div className="hs-overlay-animation-target hs-overlay-open:scale-100 hs-overlay-open:opacity-100 scale-95 opacity-0 ease-in-out transition-all duration-200 max-w-2xl lg:w-full m-3 mx-auto min-h-[calc(100%-56px)] flex items-center">
        <div className="w-full flex flex-col card border border-default-200 shadow-2xs rounded-xl pointer-events-auto bg-white">
          <div className="card-header flex justify-between items-center py-3 px-4 border-b">
            <h3 className="font-semibold text-base text-default-800">添加财务流水</h3>
            <button type="button" ref={closeBtnRef} aria-label="Close" data-hs-overlay="#financial-record-add-modal">
              <X className="size-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="card-body p-4 overflow-y-auto" style={{ maxHeight: '70vh' }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-none">
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
                  <label className="block mb-2 text-sm font-medium">交易类型 <span className="text-danger">*</span></label>
                  <select
                    className="form-input w-full border rounded p-2"
                    {...register("trade_type", { required: "必须选择交易类型" })}
                  >
                    <option value="">-- 请选择 --</option>
                    <option value="收入">收入</option>
                    <option value="支出">支出</option>
                    <option value="退费">退费</option>
                  </select>
                  {errors.trade_type && <span className="text-xs text-danger mt-1">{errors.trade_type.message}</span>}
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium">交易类别 <span className="text-danger">*</span></label>
                  <select
                    className="form-input w-full border rounded p-2"
                    {...register("category", { required: "必须选择类别" })}
                  >
                    <option value="">-- 请选择 --</option>
                    <option value="学费">学费</option>
                    <option value="教材费">教材费</option>
                    <option value="薪资">薪资</option>
                    <option value="房租">房租</option>
                    <option value="水费">水费</option>
                    <option value="电费">电费</option>
                    <option value="其他">其他</option>
                  </select>
                  {errors.category && <span className="text-xs text-danger mt-1">{errors.category.message}</span>}
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium">金额 <span className="text-danger">*</span></label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-input w-full border rounded p-2"
                    {...register("amount", { required: "金额为必填项", valueAsNumber: true, min: { value: 0.01, message: "金额必须大于0" } })}
                  />
                  {errors.amount && <span className="text-xs text-danger mt-1">{errors.amount.message}</span>}
                </div>

                <div className="md:col-span-2">
                  <label className="block mb-2 text-sm font-medium">备注 (付款方式、交易单号等)</label>
                  <textarea
                    className="form-input w-full border rounded p-2"
                    rows="3"
                    {...register("remark", { required: "备注为必填项" })}
                  ></textarea>
                  {errors.remark && <span className="text-xs text-danger mt-1">{errors.remark.message}</span>}
                </div>
              </div>
            </div>

            <div className="card-footer p-4 flex justify-end gap-2 border-t">
              <button type="button" className="btn bg-transparent text-danger" onClick={() => reset()} data-hs-overlay="#financial-record-add-modal">取消</button>
              <button type="submit" className="btn bg-primary text-white px-4 py-2 rounded">确认添加</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddFinancialRecord;