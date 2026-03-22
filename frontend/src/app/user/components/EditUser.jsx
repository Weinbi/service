import { useState, useEffect, useRef } from 'react';
import axios from '@/utils/request';
import { X } from 'lucide-react';
import Flatpickr from 'react-flatpickr';
import { Mandarin } from 'flatpickr/dist/l10n/zh.js';
import { useForm, Controller } from 'react-hook-form';
import { showAlert } from '@/components/Alert';

const EditUser = ({ user, onUpdateSuccess }) => {
  const closeBtnRef = useRef(null);
  const [roles, setRoles] = useState([]);

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
    defaultValues: {
      real_name: '', phone: '', bank_name: '', bank_account: '',
      role_id: '', status: 1, join_date: '', resignation_date: ''
    }
  });

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await axios.get('/api/roles');
        setRoles(res.data);
      } catch (error) {
        console.error('无法获取角色列表', error);
      }
    };
    fetchRoles();
  }, []);

  useEffect(() => {
    if (user) {
      reset({
        real_name: user.real_name || '',
        phone: user.phone || '',
        bank_name: user.bank_name || '',
        bank_account: user.bank_account || '',
        role_id: user.role_id || '',
        status: user.status ?? 1,
        join_date: user.join_date ? user.join_date : '',
        resignation_date: user.resignation_date ? user.resignation_date : ''
      });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    if (!user) return;
    try {
      await axios.put(`/api/users/${user.id}`, data);
      showAlert('用户信息更新成功', 'success');
      onUpdateSuccess();
      closeBtnRef.current?.click();
    } catch (error) {
      showAlert(error.response?.data?.message || error.message || '更新失败', 'danger');
    }
  };

  return (
    <div id="user-edit-modal" className="hs-overlay hidden size-full fixed top-0 start-0 z-80 overflow-x-hidden overflow-y-auto pointer-events-none">
      <div className="hs-overlay-animation-target hs-overlay-open:scale-100 hs-overlay-open:opacity-100 scale-95 opacity-0 ease-in-out transition-all duration-200 max-w-2xl lg:w-full m-3 mx-auto min-h-[calc(100%-56px)] flex items-center">
        <div className="w-full flex flex-col card border border-default-200 shadow-2xs rounded-xl pointer-events-auto bg-white">
          <div className="card-header flex justify-between items-center py-3 px-4 border-b">
            <h3 className="font-semibold text-base text-default-800">编辑用户信息</h3>
            <button type="button" ref={closeBtnRef} aria-label="Close" data-hs-overlay="#user-edit-modal">
              <X className="size-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="card-body p-4 overflow-y-auto" style={{ maxHeight: '70vh' }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-none">
                <div>
                  <label className="block mb-2 text-sm font-medium">真实姓名 <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-input w-full border rounded p-2"
                    {...register("real_name", { required: "真实姓名为必填项" })}
                  />
                  {errors.real_name && <span className="text-xs text-danger mt-1">{errors.real_name.message}</span>}
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium">联系电话</label>
                  <input
                    type="text"
                    className="form-input w-full border rounded p-2"
                    {...register("phone", { pattern: { value: /^1[3-9]\d{9}$/, message: "请输入有效的手机号" } })}
                  />
                  {errors.phone && <span className="text-xs text-danger mt-1">{errors.phone.message}</span>}
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium">角色分配</label>
                  <select
                    className="form-input w-full border rounded p-2"
                    {...register("role_id", { valueAsNumber: true })}
                  >
                    <option value="">-- 请选择角色 --</option>
                    {roles.map(role => (
                      <option key={role.id} value={role.id}>
                        {role.role_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium">在职状态</label>
                  <select className="form-input w-full border rounded p-2" {...register("status", { valueAsNumber: true })} >
                    <option value={1}>在职</option>
                    <option value={0}>离职</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium">开户行</label>
                  <input type="text" className="form-input w-full border rounded p-2" {...register("bank_name")} />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium">银行账号</label>
                  <input type="text" className="form-input w-full border rounded p-2" {...register("bank_account")} />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium">入职日期</label>
                  <Controller
                    name="join_date"
                    control={control}
                    render={({ field }) => (
                      <Flatpickr
                        options={{ mode: 'single', dateFormat: 'Y-m-d', locale: Mandarin }}
                        value={field.value}
                        onChange={(date) => field.onChange(date.length > 0 ? date[0].toLocaleDateString('zh-CN') : null)}
                        className="form-input w-full border rounded p-2"
                        placeholder="选择入职日期"
                      />
                    )}
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium">离职日期</label>
                  <Controller
                    name="resignation_date"
                    control={control}
                    render={({ field }) => (
                      <Flatpickr
                        options={{ mode: 'single', dateFormat: 'Y-m-d', locale: Mandarin }}
                        value={field.value}
                        onChange={(date) => field.onChange(date.length > 0 ? date[0].toLocaleDateString('zh-CN') : null)}
                        className="form-input w-full border rounded p-2"
                        placeholder="选择离职日期"
                      />
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="card-footer p-4 flex justify-end gap-2 border-t">
              <button type="button" className="btn bg-transparent text-danger" data-hs-overlay="#user-edit-modal">取消</button>
              <button type="submit" className="btn bg-primary text-white px-4 py-2 rounded">保存修改</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditUser;