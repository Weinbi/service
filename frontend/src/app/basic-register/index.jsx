import logo from '@/assets/images/logo.png';
import PageMeta from '@/components/PageMeta';
import { Link, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import request from '@/utils/request';
import { showAlert } from '@/components/Alert';

const Index = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm();

  const onSubmit = async (data) => {
    try {
      // 通过 request 统一实例发起 POST 请求
      await request.post('/api/register', data);

      // 成功后跳转到登录页面 (可根据您的全局 Toast 配置提示 "注册成功")
      navigate('/basic-login');
      showAlert('注册成功', 'success');
    } catch (error) {
      console.error('注册失败', error);
      // utils/request 内部的拦截器应当已处理了错误 Toast，这里无需手动编写弹窗
    }
  };

  return (
    <>
      <PageMeta title="注册" />
      <div className="relative min-h-screen w-full flex justify-center items-center py-16 md:py-10">
        <div className="card md:w-lg w-screen z-10">
          <div className="text-center px-10 py-12">
            <Link to="/" className="flex justify-center">
              <img src={logo} alt="logo dark" className="h-8 flex dark:hidden" width={111} />
            </Link>

            <div className="mt-8 text-center">
              <h4 className="mb-2.5 text-xl font-semibold text-primary">
                创建一个账户
              </h4>
              <p className="text-base text-default-500">请输入您的注册信息</p>
            </div>

            {/* 表单使用 react-hook-form 接管 */}
            <form onSubmit={handleSubmit(onSubmit)} className="text-left w-full mt-10">

              <div className="mb-4">
                <label htmlFor="username" className="block font-medium text-default-900 text-sm mb-2">
                  用户名
                </label>
                <input type="text" id="username" className="form-input" placeholder="请输入用于登录的用户名" {...register('username', { required: '用户名为必填项' })} />

                {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="block font-medium text-default-900 text-sm mb-2">
                  密码
                </label>
                <input
                  type="password"
                  id="password"
                  className="form-input"
                  placeholder="请输入密码"
                  {...register('password', {
                    required: '密码为必填项',
                    minLength: { value: 6, message: '密码长度至少为 6 位' }
                  })}
                />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
              </div>

              <div className="mb-4">
                <label htmlFor="real_name" className="block font-medium text-default-900 text-sm mb-2">
                  真实姓名
                </label>
                <input
                  type="text"
                  id="real_name"
                  className="form-input"
                  placeholder="请输入您的真实姓名"
                  {...register('real_name', { required: '真实姓名为必填项' })}
                />
                {errors.real_name && <p className="text-red-500 text-xs mt-1">{errors.real_name.message}</p>}
              </div>

              <div className="mb-4">
                <label htmlFor="phone" className="block font-medium text-default-900 text-sm mb-2">
                  手机号
                </label>
                <input
                  type="text"
                  id="phone"
                  className="form-input"
                  placeholder="请输入您的手机号码"
                  {...register('phone', {
                    required: '手机号为必填项',
                    pattern: {
                      value: /^1[3-9]\d{9}$/,
                      message: '请输入有效的11位手机号码'
                    }
                  })}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
              </div>

              <div className="mt-10 text-center">
                <button type="submit" disabled={isSubmitting} className="btn bg-primary text-white w-full disabled:opacity-50" >
                  {isSubmitting ? '提交中...' : '注册'}
                </button>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-default-500">
                  已有账户? <Link to="/basic-login" className="text-primary font-semibold hover:underline">去登录</Link>
                </p>
              </div>
            </form>

          </div>
        </div>

        {/* 背景 SVG 装饰，保持原样 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
    </>
  );
};

export default Index;