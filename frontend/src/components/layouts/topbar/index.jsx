import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SidenavToggle from './SidenavToggle';
import avatarDefault from '@/assets/images/user/avatar-default.png';
import { showAlert } from '@/components/Alert';
import { LogOut } from 'lucide-react';

const Topbar = () => {
  const [userInfo, setUserInfo] = useState({
    real_name: 'User',
    role_name: 'Guest'
  });
  const navigate = useNavigate();

  // 组件挂载时读取 localStorage 中的用户信息
  useEffect(() => {
    const storedInfo = localStorage.getItem('userInfo');
    if (storedInfo) {
      try {
        const parsedInfo = JSON.parse(storedInfo);
        setUserInfo(parsedInfo);
      } catch (error) {
        console.error('Failed to parse user info', error);
      }
    }
  }, []);

  const handleLogout = (e) => {
    e.preventDefault(); // 阻止 <a> 标签的默认跳转行为

    // 清除登录时存储在 localStorage 中的信息
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('permissions');

    // 提示用户并跳转回登录页
    showAlert('已成功退出登录', 'success');
    navigate('/basic-login');
  };

  return <div className="app-header min-h-topbar-height flex items-center sticky top-0 z-30 bg-(--topbar-background) border-b border-default-200">
    <div className="w-full flex items-center justify-between px-6">
      <div className="flex items-center gap-5">
        <SidenavToggle />
      </div>
      <div className="flex items-center gap-3">

        <div className="topbar-item hs-dropdown relative inline-flex">
          <button className="cursor-pointer bg-pink-100 rounded-full">
            <img src={avatarDefault} alt="user" className="hs-dropdown-toggle rounded-full size-9.5" />
          </button>
          <div className="hs-dropdown-menu min-w-48">
            <div className="p-2">
              <h6 className="mb-2 text-default-500">个人信息</h6>
              <Link to="/settings" className="flex gap-3">
                <div className="relative inline-block">
                  <img src={avatarDefault} alt="user" className="size-12 rounded" />
                </div>
                <div>
                  <h6 className="mb-1 text-sm font-semibold text-default-800">{userInfo.real_name || userInfo.username}</h6>
                  <p className="text-default-500 text-xs">{userInfo.role_name || '无角色'}</p>
                </div>
              </Link>
            </div>

            <div className="flex flex-col gap-y-1">
              <div className="border-t border-default-200 -mx-2 my-1"></div>
              <Link to="#" onClick={handleLogout} className="flex items-center gap-x-3.5 py-1.5 px-3 text-default-600 hover:bg-default-150 rounded font-medium">
                <LogOut className="size-4" /> 退出
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
};
export default Topbar;