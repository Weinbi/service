import { useEffect, useState, useRef } from 'react';
import axios from '@/utils/request';
import { X, Plus } from 'lucide-react';

const StudentDetails = ({ student, refreshTrigger }) => {
  const closeBtnRef = useRef(null);
  const [details, setDetails] = useState(null);

  useEffect(() => {
    if (student) {
      const fetchDetails = async () => {
        try {
          const res = await axios.get(`/api/students/${student.id}`);
          setDetails(res.data);
        } catch (error) {
          console.error('获取详情失败', error);
        }
      };
      fetchDetails();
    }
  }, [student, refreshTrigger]);

  const records = details?.records 
    ? (typeof details.records === 'string' ? JSON.parse(details.records) : details.records) 
    : [];

  return (
    <div id="student-details-modal" className="hs-overlay hidden size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto pointer-events-none">
      <div className="hs-overlay-animation-target hs-overlay-open:scale-100 hs-overlay-open:opacity-100 scale-95 opacity-0 ease-in-out transition-all duration-200 max-w-5xl lg:w-full m-3 mx-auto min-h-[calc(100%-56px)] flex items-center">
        <div className="w-full flex flex-col card border border-default-200 shadow-2xs rounded-xl pointer-events-auto bg-white min-h-[60vh]">
          
          <div className="card-header flex justify-between items-center py-3 px-4 border-b">
            <h3 className="font-semibold text-base text-default-800">
              学生档案: <span className="text-primary">{details?.name}</span>
            </h3>
            <button type="button" ref={closeBtnRef} aria-label="Close" data-hs-overlay="#student-details-modal">
              <X className="size-5 text-default-600 hover:text-danger" />
            </button>
          </div>

          <div className="card-body p-6 overflow-y-auto max-h-[75vh]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* 左侧：学生基本信息 */}
              <div className="md:col-span-1 border-e border-default-200 pe-4">
                <h4 className="text-sm font-semibold mb-4 text-default-800">基本信息</h4>
                <div className="space-y-4 text-sm text-default-600">
                  <div>
                    <span className="font-medium">姓名：</span> {details?.name}
                  </div>
                  <div>
                    <span className="font-medium">家长电话：</span> {details?.parent_phone}
                  </div>
                  <div>
                    <span className="font-medium">当前状态：</span> 
                    <span className="bg-default-100 text-default-800 py-1 px-2 rounded ml-1 text-xs">{details?.status}</span>
                  </div>
                  <div>
                    <span className="font-medium">负责顾问：</span> {details?.consultant_name || '未分配'}
                  </div>
                  <div>
                    <span className="font-medium">创建时间：</span> 
                    {details?.created_at ? new Date(details.created_at).toLocaleString('zh-CN') : '-'}
                  </div>
                </div>
              </div>

              {/* 右侧：跟进动态时间轴 */}
              <div className="md:col-span-2 ps-2">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-sm font-semibold text-default-800">跟进动态</h4>
                  <button 
                    className="btn btn-sm bg-primary text-white flex items-center gap-1"
                    data-hs-overlay="#student-add-record-modal"
                  >
                    <Plus className="size-4" /> 添加跟进动态
                  </button>
                </div>

                <div className="relative border-s-2 border-default-200 ps-4 ms-2 pt-2">
                  {records.length > 0 ? (
                    records.slice().reverse().map((record) => (
                      <div key={record.id} className="mb-6 relative">
                        {/* 圆点指示器 */}
                        <span className="absolute -start-[25px] flex items-center justify-center size-4 bg-primary text-white rounded-full ring-4 ring-white"></span>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-default-500">
                            {new Date(record.created_at).toLocaleString('zh-CN')} · <span className="text-primary">{record.operator}</span>
                          </span>
                          <p className="mt-1.5 text-sm text-default-800 bg-default-50 p-3 rounded-lg border border-default-100 inline-block">
                            {record.content}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-default-500">暂无跟进动态</p>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetails;