import axios from 'axios';
import { showAlert } from '@/components/Alert';

// 1. 创建一个新的 axios 实例
const request = axios.create({
    // 如果你配置了 vite 的 proxy 代理，可以填入 '/api' 或者留空
    // baseURL: import.meta.env.VITE_API_BASE_URL || '', 
    timeout: 10000, // 请求超时时间：10秒
    headers: {
        'Content-Type': 'application/json'
    }
});

// 2. 请求拦截器 (Request Interceptor)
request.interceptors.request.use(
    (config) => {
        // 每次发送请求前，自动从 localStorage 获取 Token 并携带
        // 注意：这里的 'token' 请替换为你项目中实际存储的 key 名称
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 3. 响应拦截器 (Response Interceptor)
request.interceptors.response.use(
    (response) => {
        // 请求成功，直接返回后端的数据本体 (例如 { code: 200, data: {...} })
        return response;
    },
    (error) => {
        // 统一错误处理逻辑
        if (error.response) {
            const { status, data } = error.response;

            switch (status) {
                case 401:
                    // 真正的 Token 过期或无效，才执行登出逻辑
                    showAlert('登录凭证已过期，请重新登录', 'danger');
                    localStorage.removeItem('token'); // 清除失效 token
                    localStorage.removeItem('userInfo');
                    localStorage.removeItem('permissions');
                    // 跳转到登录页 (请根据你的实际路由调整)
                    window.location.href = '/basic-login';
                    break;

                case 403:
                    showAlert('您没有权限执行此操作', 'danger');
                    break;

                case 404:
                    showAlert('请求的接口或资源不存在', 'danger');
                    break;

                case 500:
                    // 数据库外键冲突、代码报错等后端内部错误会走到这里
                    // 拦截下来并提示用户，绝不触发跳转！
                    showAlert(data?.message || data?.error || '服务器内部错误，操作失败', 'danger');
                    break;

                default:
                    showAlert(data?.message || `请求错误 (${status})`, 'danger');
            }
        } else {
            // 处理断网或请求超时的情况
            showAlert('网络连接异常，请检查您的网络设置', 'danger');
        }

        // 将错误继续抛出，以便组件内部还能使用 catch 单独处理特殊逻辑
        return Promise.reject(error);
    }
);

export default request;