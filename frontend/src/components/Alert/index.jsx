// frontend/src/components/Alert.jsx
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { CircleCheck, CircleAlert, ShieldAlert, TriangleAlert } from 'lucide-react';

// 图标与类型的映射表
const iconMapper = {
  success: CircleCheck,
  info: CircleAlert,
  warning: ShieldAlert,
  danger: TriangleAlert,
};

// 样式与类型的映射表
const typeStyles = {
  success: 'bg-success/15 border-success/50 text-success',
  info: 'bg-info/15 border-info/50 text-info',
  warning: 'bg-warning/15 border-warning/50 text-warning',
  danger: 'bg-danger/15 border-danger/50 text-danger',
};

// --- 1. 单个 Alert 渲染组件 ---
const AlertItem = ({ id, type, message, duration, onRemove }) => {
  const [visible, setVisible] = useState(false);
  const Icon = iconMapper[type] || CircleAlert;

  useEffect(() => {
    // 挂载后稍微延迟触发显示动画
    const showTimer = setTimeout(() => setVisible(true), 10);

    // 设置定时器，到达时间后触发隐藏动画，随后从 DOM 树中移除
    const hideTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onRemove(id), 300); // 300ms 对应 Tailwind 的 duration-300
    }, duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [duration, id, onRemove]);

  return (
    // 使用 max-height 动画，使元素被移除时，下方的 Alert 能平滑上移
    <div className={`transition-all duration-300 ease-in-out overflow-hidden ${visible ? 'opacity-100 translate-y-0 max-h-32 mt-0 scale-100' : 'opacity-0 -translate-y-5 max-h-0 !mt-0 !mb-0 scale-95'}`} >
      {/* 内部容器开启 pointer-events-auto 以防需要点击 */}
      <div className={`border rounded-xl shadow-xl flex items-center gap-3.5 p-4 min-w-[350px] max-w-md pointer-events-auto ${typeStyles[type]}`} role="alert">
        <Icon className="w-6 h-6 shrink-0" strokeWidth={1.5} />
        <span className="font-semibold text-sm leading-tight">{message}</span>
      </div>
    </div>
  );
};

// --- 2. 全局通信变量 ---
let addAlertFn = null;       // 用于向全局容器追加 Alert 的函数
let containerRoot = null;    // React 根节点实例
let alertQueue = [];         // 用于保存在容器初始化完成前就调用的 Alert

// --- 3. 全局唯一容器组件 ---
const AlertContainer = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // 挂载后，将更新 state 的方法暴露给外部模块变量
    addAlertFn = (newAlert) => {
      setAlerts((prev) => [...prev, newAlert]);
    };

    // 如果挂载前队列里已经有缓存的 Alert（如连续快速调用），则一并渲染
    if (alertQueue.length > 0) {
      setAlerts((prev) => [...prev, ...alertQueue]);
      alertQueue = []; // 清空队列
    }
  }, []);

  const removeAlert = (id) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    // 外层容器使用 flex-col 纵向排列，gap-3 设置间距。
    // pointer-events-none 确保整个隐形的列容器不会阻挡页面点击事件。
    <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-[9999] flex flex-col gap-3 pointer-events-none items-center">
      {alerts.map((alert) => (
        <AlertItem key={alert.id} {...alert} onRemove={removeAlert} />
      ))}
    </div>
  );
};

// --- 4. 暴露的命令式调用 API ---
let idCounter = 0; // 自增 ID，确保 React Key 的唯一性

export const showAlert = (message, type = 'info', duration = 3000) => {
  idCounter++;
  const newAlert = { id: idCounter, message, type, duration };

  if (!containerRoot) {
    // 【首次调用】初始化 DOM 挂载点
    const container = document.createElement('div');
    document.body.appendChild(container);
    containerRoot = createRoot(container);
    containerRoot.render(<AlertContainer />);

    // 因为 React 的 render 是异步的，此时 addAlertFn 还没被赋值，所以先推入队列
    alertQueue.push(newAlert);
  } else if (addAlertFn) {
    // 【后续调用】容器已经准备就绪，直接追加状态
    addAlertFn(newAlert);
  } else {
    // 极端情况：容器正在 render 中，还没执行到 useEffect
    alertQueue.push(newAlert);
  }
};