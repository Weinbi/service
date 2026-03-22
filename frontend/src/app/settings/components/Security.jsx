import React from 'react';
import { useForm } from 'react-hook-form';
import axios from '@/utils/request';
import { showAlert } from '@/components/Alert';

export default function Security() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  // 监听新密码，用于验证“确认密码”是否一致
  const newPassword = watch("newPassword");

  // 表单提交处理
  const onSubmit = async (data) => {
    try {
      const response = await axios.post('/api/user/change-password', {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });

      if (response.status === 200) {
        showAlert('密码修改成功', 'success'); // 成功提示
        reset(); // 清空表单
      } else {
        showAlert(response.data.message || "修改失败", 'warning'); // 失败提示
      }
    } catch (error) {
      const msg = error.response?.data?.message || "网络请求失败或原密码错误";
      showAlert(msg, 'warning'); // 失败提示
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">修改密码</h2>
        <p className="text-sm text-gray-500">
          账号密码是您账号的唯一通行证，请妥善保管
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl">
        {/* Current password */}
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-2">当前密码</label>
          <input
            {...register("oldPassword", { required: "请输入当前密码" })}
            type="password"
            placeholder="••••••••"
            className="w-full bg-gray-50 border-none rounded-lg px-4 py-3 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow placeholder-gray-400"
          />
          {errors.oldPassword && (<span className="text-red-500 text-sm mt-1">{errors.oldPassword.message}</span>)}
        </div>

        {/* New password */}
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-2">新密码</label>
          <input
            {...register("newPassword", { required: "请输入新密码", minLength: { value: 6, message: "密码长度至少需要6个字符" } })}
            type="password"
            placeholder="••••••••"
            className="w-full bg-gray-50 border-none rounded-lg px-4 py-3 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow placeholder-gray-400"
          />
          {errors.newPassword && (<span className="text-red-500 text-sm mt-1">{errors.newPassword.message}</span>)}
        </div>

        {/* Confirm new password */}
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-2">确认密码</label>
          <input
            {...register("confirmPassword", { required: "请确认新密码", validate: (value) => value === newPassword || "两次输入的密码不一致" })}
            type="password"
            placeholder="••••••••"
            className="w-full bg-gray-50 border-none rounded-lg px-4 py-3 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow placeholder-gray-400"
          />
          {errors.confirmPassword && (<span className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</span>)}
        </div>

        {/* Update Button */}
        <div className="flex justify-end pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors focus:ring-4 focus:ring-blue-200 outline-none"
          >
            {isSubmitting ? "提交中..." : "确认修改"}
          </button>
        </div>
      </form>
    </div>
  );
}