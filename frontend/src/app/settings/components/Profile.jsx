import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from '@/utils/request';
import { showAlert } from '@/components/Alert';

export default function Profile() {
  // 使用 react-hook-form 接管表单
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      real_name: '',
      phone: ''
    }
  });

  const [loading, setLoading] = useState(false);

  // 初始化加载当前用户信息
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await axios.get('/api/users/profile');
      // 使用 react-hook-form 的 setValue 回显数据
      setValue('real_name', res.data.real_name || '');
      setValue('phone', res.data.phone || '');

    } catch (error) {
      console.error('获取用户信息失败', error);
    }
  };

  // 更新本地缓存中的 userInfo 辅助函数
  const updateLocalUserInfo = (updateFields) => {
    try {
      const userInfoStr = localStorage.getItem('userInfo');
      if (userInfoStr) {
        const userInfo = JSON.parse(userInfoStr);
        // 将新字段合并到缓存对象中
        const updatedUserInfo = { ...userInfo, ...updateFields };
        localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
      }
    } catch (e) {
      console.error('更新本地缓存 userInfo 失败', e);
    }
  };

  // 提交表单（经过 react-hook-form 校验后才会触发）
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await axios.put('/api/users/profile', {
        real_name: data.real_name,
        phone: data.phone
      });

      // 更新成功后，将新的 real_name 和 phone 写入缓存中的 userInfo
      updateLocalUserInfo({
        real_name: data.real_name,
        phone: data.phone,
      });

      showAlert('资料更新成功！', 'success');
    } catch (error) {
      showAlert('资料更新失败', 'warning');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-8">个人资料</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First name */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">真实姓名</label>
            <input
              {...register('real_name', { required: '真实姓名不能为空' })}
              type="text"
              className="w-full bg-gray-50 border-none rounded-lg px-4 py-3 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
            />
            {errors.real_name && <span className="text-red-500 text-sm mt-1">{errors.real_name.message}</span>}
          </div>

          {/* User name */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">手机号</label>
            <input
              {...register('phone', { required: '手机号不能为空', pattern: { value: /^1[3-9]\d{9}$/, message: '请输入正确的11位手机号' } })}
              type="text"
              className="w-full bg-gray-50 border-none rounded-lg px-4 py-3 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
            />
            {errors.phone && <span className="text-red-500 text-sm mt-1">{errors.phone.message}</span>}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-6">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors focus:ring-4 focus:ring-blue-200 outline-none"
          >
            {loading ? '更新中...' : '更新资料'}
          </button>
        </div>
      </form>
    </div>
  );
}