import { useRef } from 'react';
import { X, Calendar } from 'lucide-react';

const TextbookDetail = ({ textbook }) => {
  const closeBtnRef = useRef(null);

  // 解析 distribution_records
  const records = typeof textbook?.distribution_records === 'string' 
    ? JSON.parse(textbook.distribution_records) 
    : (textbook?.distribution_records || []);

  return (
    <div id="textbook-detail-modal" className="hs-overlay hidden size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto pointer-events-none">
      <div className="hs-overlay-animation-target hs-overlay-open:scale-100 hs-overlay-open:opacity-100 scale-95 opacity-0 ease-in-out transition-all duration-200 max-w-2xl lg:w-full m-3 mx-auto min-h-[calc(100%-56px)] flex items-center">
        <div className="w-full flex flex-col card border border-default-200 shadow-2xs rounded-xl pointer-events-auto bg-white">
          <div className="card-header flex justify-between items-center py-3 px-4 border-b">
            <h3 className="font-semibold text-base text-default-800">教材记录详情：{textbook?.book_name}</h3>
            <button type="button" ref={closeBtnRef} aria-label="Close" data-hs-overlay="#textbook-detail-modal">
              <X className="size-5" />
            </button>
          </div>

          <div className="card-body p-6 overflow-y-auto max-h-[70vh]">
            <h4 className="text-sm font-semibold mb-4 text-default-600">分发及入库记录</h4>
            
            {records.length > 0 ? (
              <div className="relative border-s border-default-200 ml-3">
                {records.map((record, index) => (
                  <div key={index} className="mb-6 ms-4">
                    <div className="absolute w-3 h-3 bg-primary rounded-full mt-1.5 -start-1.5 border border-white"></div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-semibold text-default-800">
                        {record.type} <span className="text-primary ml-1">{record.type === '入库' ? '+' : '-'}{record.quantity}</span> 本
                      </span>
                      <span className="text-xs text-default-400 flex items-center gap-1">
                        <Calendar className="size-3" />
                        {new Date(record.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-default-500 mt-1">
                      操作人: {record.real_name} 
                      {record.student_info && record.student_info.length > 0 && ` | 相关学生: ${record.student_info.map(s => s.name).join(', ')}`}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-default-400">暂无任何记录</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextbookDetail;