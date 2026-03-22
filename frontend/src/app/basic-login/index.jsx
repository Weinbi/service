import { useState } from "react";
import logo from '@/assets/images/logo.png';
import PageMeta from '@/components/PageMeta';
import { appName } from '@/helpers/constants';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import axios from "axios";
import { showAlert } from '@/components/Alert';

const Index = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 初始化 react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // 表单提交处理
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // 发送登录请求
      const response = await axios.post("api/login", {
        username: data.username,
        password: data.password,
      });

      if (response.status == 200) {
        const { token, userInfo, permissions } = response.data;

        // 本地缓存 Token
        localStorage.setItem("token", token);
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        localStorage.setItem('permissions', JSON.stringify(permissions));

        navigate('/starter');
      } else {
        showAlert(response.data.message || '登录失败', 'warning');
      }
    } catch (error) {
      console.error("登录错误:", error);
      const errorMsg = error.response?.data?.message || "登录请求失败，请检查网络或联系管理员";
      showAlert(errorMsg, 'warning');
    } finally {
      setLoading(false);
    }
  };

  return <>
    <PageMeta title="登录" />
    <div className="relative min-h-screen w-full flex justify-center items-center py-16 md:py-10">
      <div className="card md:w-lg w-screen z-10">
        <div className="text-center px-10 py-12">
          <Link to="/" className="flex justify-center">
            <img src={logo} alt="logo dark" className="h-8 flex dark:hidden" />
          </Link>

          <div className="mt-8 text-center">
            <h4 className="mb-2.5 text-xl font-semibold text-primary">欢迎使用{appName}</h4>
            <p className="text-base text-default-500">请使用账号和密码登录</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="text-left w-full mt-10">
            <div className="mb-4">
              <label htmlFor="username" className="block font-medium text-default-900 text-sm mb-2">
                用户名
              </label>
              <input type="text" id="username" className="form-input" placeholder="输入用户名" {...register("username", { required: "用户名不能为空", minLength: { value: 3, message: "用户名至少需要3个字符" } })} />
              {errors.username && (<p className="text-sm text-red-500">{errors.username.message}</p>)}
            </div>

            <div className="mb-4">
              <label htmlFor="Password" className="block font-medium text-default-900 text-sm mb-2">
                密码
              </label>
              <input type="password" id="Password" className="form-input" placeholder="输入密码" {...register("password", { required: "密码不能为空", minLength: { value: 6, message: "密码至少需要6个字符" } })} />
              {errors.password && (<p className="text-sm text-red-500">{errors.password.message}</p>)}
            </div>

            <div className="mt-10 text-center">
              <button type="submit" className="btn bg-primary text-white w-full" disabled={loading}>
                {loading ? "登录中..." : "登录"}
              </button>
            </div>

            <div className="mt-10 text-center">
              <p className="text-sm text-default-500">
                还没有一个账号 ?{' '}
                <Link to="/basic-register" className="text-primary font-semibold hover:underline">
                  注册
                </Link>
              </p>
            </div>

          </form>
        </div>
      </div>

      <div className="absolute inset-0 overflow-hidden">
        <svg aria-hidden="true" className="absolute inset-0 size-full fill-black/2 stroke-black/5 dark:fill-white/2.5 dark:stroke-white/2.5">
          <defs>
            <pattern id="authPattern" width="56" height="56" patternUnits="userSpaceOnUse" x="50%" y="16">
              <path d="M.5 56V.5H72" fill="none"></path>
            </pattern>
          </defs>
          <rect width="100%" height="100%" strokeWidth="0" fill="url(#authPattern)"></rect>
        </svg>
      </div>
    </div>
  </>;
};
export default Index;