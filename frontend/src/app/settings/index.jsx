import React, { useState } from 'react';
import { User, Lock, Receipt} from 'lucide-react';
import Profile from './components/Profile';
import Security from './components/Security';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');

  const menuItems = [
    { id: 'profile', label: '个人资料', icon: User },
    { id: 'security', label: '安全设置', icon: Lock },
    { id: 'salary', label: '工资结算', icon: Receipt },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* 主容器 */}
      <div className="mx-auto max-w-6xl bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row min-h-[600px]">

        {/* 左侧侧边栏 */}
        <div className="w-full md:w-64 p-6 border-b md:border-b-0 md:border-r border-gray-100 flex-shrink-0">
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                >
                  <Icon size={18} className={isActive ? 'text-gray-700' : 'text-gray-500'} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* 右侧内容区域 */}
        <div className="flex-1 p-6 md:p-10">
          {activeTab === 'profile' && <Profile />}
          {activeTab === 'security' && <Security />}
          {/* 其他 Tab 内容可以在此添加 */}
          {activeTab === 'notification' && <div>Notification Settings</div>}
          {activeTab === 'billing' && <div>Billing Settings</div>}
          {activeTab === 'integration' && <div>Integration Settings</div>}
        </div>
      </div>
    </div>
  );
}