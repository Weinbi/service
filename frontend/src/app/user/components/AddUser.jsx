import { useState, useEffect, useRef } from 'react';
import axios from '@/utils/request';
import { X } from 'lucide-react';
import Flatpickr from 'react-flatpickr';
import { Mandarin } from 'flatpickr/dist/l10n/zh.js';
import { useForm, Controller } from 'react-hook-form';
import { showAlert } from '@/components/Alert';

const AddUser = ({ onAddSuccess }) => {
  const closeBtnRef = useRef(null);
  const [roles, setRoles] = useState([]);

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

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
    defaultValues: {
      username: '', password: '', real_name: '', phone: '',
      bank_name: '', bank_account: '', role_id: '',
      status: 1, join_date: '', resignation_date: ''
    }
  });

  const onSubmit = async (data) => {
    try {
      await axios.post('/api/users', data);
      showAlert('添加用户成功', 'success');
      onAddSuccess();
      reset();
      closeBtnRef.current?.click();
    } catch (error) {
      showAlert(error.response?.data?.message || error.message || '添加失败', 'danger');
    }
  };

  return (
    <div id="user-add-modal" className="hs-overlay hidden size-full fixed top-0 start-0 z-80 overflow-x-hidden overflow-y-auto pointer-events-none">
      <div className="hs-overlay-animation-target hs-overlay-open:scale-100 hs-overlay-open:opacity-100 scale-95 opacity-0 ease-in-out transition-all duration-200 max-w-2xl lg:w-full m-3 mx-auto min-h-[calc(100%-56px)] flex items-center">
        <div className="w-full flex flex-col card border border-default-200 shadow-2xs rounded-xl pointer-events-auto bg-white">
          <div className="card-header flex justify-between items-center py-3 px-4 border-b">
            <h3 className="font-semibold text-base text-default-800">添加新用户</h3>
            <button type="button" ref={closeBtnRef} aria-label="Close" data-hs-overlay="#user-add-modal">
              <X className="size-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="card-body p-4 overflow-y-auto" style={{ maxHeight: '70vh' }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-none">
                <div>
                  <label className="block mb-2 text-sm font-medium">登录账号 <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-input w-full border rounded p-2"
                    {...register("username", { required: "登录账号为必填项" })}
                  />
                  {errors.username && <span className="text-xs text-danger mt-1">{errors.username.message}</span>}
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium">初始密码 <span className="text-danger">*</span></label>
                  <input
                    type="password"
                    className="form-input w-full border rounded p-2"
                    {...register("password", {
                      required: "初始密码为必填项",
                      minLength: { value: 6, message: "密码长度不能少于6位" }
                    })}
                  />
                  {errors.password && <span className="text-xs text-danger mt-1">{errors.password.message}</span>}
                </div>

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
                    {...register("phone", {
                      pattern: { value: /^1[3-9]\d{9}$/, message: "请输入有效的手机号" }
                    })}
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
                  <select
                    className="form-input w-full border rounded p-2"
                    {...register("status", { valueAsNumber: true })}
                  >
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
              <button type="button" className="btn bg-transparent text-danger" onClick={() => reset()} data-hs-overlay="#user-add-modal">取消</button>
              <button type="submit" className="btn bg-primary text-white px-4 py-2 rounded">确认添加</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUser;