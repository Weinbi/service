import React, { useEffect } from 'react';
import LayoutProvider from '@/context/useLayoutContext';
import { useLocation } from 'react-router';
import 'preline';

const ProvidersWrapper = ({ children }) => {
  const location = useLocation();

  // 2. 监听路由变化，跳转页面时重新初始化
  useEffect(() => {
    if (window.HSStaticMethods) {
      window.HSStaticMethods.autoInit();
    }
  }, [location.pathname]);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      // 1. 初始化所有可能的新 Preline 组件
      if (window.HSStaticMethods) {
        window.HSStaticMethods.autoInit();
      }

      // 2. 查找并更新现有 hs-overlay 弹窗的触发器
      if (window.HSOverlay) {
        const overlays = document.querySelectorAll('.hs-overlay');
        overlays.forEach((overlayEl) => {
          // 获取该 DOM 元素对应的 Preline 实例对象
          const instance = window.HSOverlay.getInstance(overlayEl, true);

          // 如果实例存在且包含 updateToggles 方法，则执行它
          if (instance && instance.element) {
            // 调用源码中的 updateToggles 方法
            instance.element.updateToggles();
          }
        });
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => observer.disconnect();
  }, []);

  return (
    <LayoutProvider>
      {children}
    </LayoutProvider>
  );
};

export default ProvidersWrapper;