import AuthBgDark from '@/assets/images/auth-bg-dark.jpg';
import AuthBg from '@/assets/images/auth-bg.jpg';
import Error404 from '@/assets/images/error-404.png';
import Logo from '@/assets/images/logo.png';
import PageMeta from '@/components/PageMeta';
import { House } from 'lucide-react';
import { Link } from 'react-router';
const PageNotFound = () => {
  return <>
    <PageMeta title="404" />
    <div className="relative h-screen w-full flex justify-center items-center">
      <div className="absolute inset-0">
        <div className="block dark:hidden h-full w-full">
          <img src={AuthBg} alt="background" className="object-cover" />
        </div>
        <div className="hidden dark:block h-full w-full">
          <img src={AuthBgDark} alt="background dark" className="object-cover" />
        </div>
      </div>

      <div className="relative z-10 bg-default-50 rounded-lg w-lg">
        <div className="text-center px-10 py-12">
          <Link to="/index" className="flex justify-center">
            <div className="block dark:hidden h-6 relative w-auto">
              <img src={Logo} alt="logo dark" className="object-contain" width={120} />
            </div>
          </Link>

          <div className="mt-10">
            <div className="h-64 relative w-auto mx-auto">
              <img src={Error404} alt="404 error" className="h-64 mx-auto" />
            </div>
          </div>

          <div className="mt-8 text-center">
            <h4 className="mb-2 text-purple-500 dark:text-white text-xl font-semibold">
              无法找到该页面
            </h4>
            <p className="mb-6 text-base text-default-500">
              抱歉，您访问的页面不存在或已被移除。
            </p>
            <Link to="/starter">
              <button type="button" className="bg-primary text-white hover:bg-blue-600 rounded text-[13px] py-2 px-4 inline-flex items-center">
                <House className="size-3 me-1" />
                返回首页
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  </>;
};
export default PageNotFound;