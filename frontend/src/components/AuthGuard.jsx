import { Navigate, useLocation } from 'react-router-dom';

const AuthGuard = ({ children }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!token) {
    // 如果没有 Token，重定向到登录页，并保存当前尝试访问的路径，以便登录后跳回
    return <Navigate to="/basic-login" state={{ from: location }} replace />;
  }

  // 如果有 Token，正常渲染子组件
  return children;
};

export default AuthGuard;