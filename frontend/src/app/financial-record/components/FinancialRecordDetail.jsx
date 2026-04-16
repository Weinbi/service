import { useRef } from 'react';
import { X } from 'lucide-react';

const FinancialRecordDetail = ({ financialRecord }) => {
  const closeBtnRef = useRef(null);

  return (
    <div id="financial-record-details-modal" className="hs-overlay hidden size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto pointer-events-none">
      <div className="hs-overlay-animation-target hs-overlay-open:scale-100 hs-overlay-open:opacity-100 scale-95 opacity-0 ease-in-out transition-all duration-200 max-w-2xl lg:w-full m-3 mx-auto min-h-[calc(100%-56px)] flex items-center">
        <div className="w-full flex flex-col card border border-default-200 shadow-2xs rounded-xl pointer-events-auto bg-white">

          <div className="card-header flex justify-between items-center py-3 px-4 border-b">
            <h3 className="font-semibold text-base text-default-800">
              流水详情: <span className="text-primary">{financialRecord?.serial_no}</span>
            </h3>
            <button type="button" ref={closeBtnRef} aria-label="Close" data-hs-overlay="#financial-record-details-modal">
              <X className="size-5 text-default-600 hover:text-danger" />
            </button>
          </div>

          <div className="card-body p-6 overflow-y-auto">
            <div className="space-y-4 text-sm text-default-600">
              <div className="flex border-b border-default-100 pb-2">
                <span className="font-medium w-24">流水号：</span>
                <span className="text-default-800">{financialRecord?.serial_no}</span>
              </div>
              <div className="flex border-b border-default-100 pb-2">
                <span className="font-medium w-24">所属校区：</span>
                <span className="text-default-800">{financialRecord?.campus_name || '-'}</span>
              </div>
              <div className="flex border-b border-default-100 pb-2">
                <span className="font-medium w-24">交易类型：</span>
                <span className={`py-0.5 px-2 inline-flex items-center text-xs font-medium rounded ${financialRecord?.trade_type === '收入' ? 'bg-success/10 text-success' : financialRecord?.trade_type === '支出' ? 'bg-danger/10 text-danger' : 'bg-warning/10 text-warning'}`}>
                  {financialRecord?.trade_type}
                </span>
              </div>
              <div className="flex border-b border-default-100 pb-2">
                <span className="font-medium w-24">交易类别：</span>
                <span className="text-default-800">{financialRecord?.category}</span>
              </div>
              <div className="flex border-b border-default-100 pb-2">
                <span className="font-medium w-24">金额：</span>
                <span className={`text-base font-bold ${financialRecord?.trade_type === '收入' ? 'text-success' : 'text-danger'}`}>
                  {financialRecord?.trade_type === '收入' ? '+' : '-'}{financialRecord?.amount}
                </span>
              </div>
              <div className="flex border-b border-default-100 pb-2">
                <span className="font-medium w-24">关联合同ID：</span>
                <span className="text-default-800">{financialRecord?.contract_id || '无'}</span>
              </div>
              <div className="flex border-b border-default-100 pb-2">
                <span className="font-medium w-24">关联退费ID：</span>
                <span className="text-default-800">{financialRecord?.refund_id || '无'}</span>
              </div>
              <div className="flex border-b border-default-100 pb-2">
                <span className="font-medium w-24">交易时间：</span>
                <span className="text-default-800">{new Date(financialRecord?.created_at).toLocaleString()}</span>
              </div>
              <div className="flex border-b border-default-100 pb-2">
                <span className="font-medium w-24">操作人：</span>
                <span className="text-default-800">{financialRecord?.operator_name || '-'}</span>
              </div>
              <div className="flex pb-2">
                <span className="font-medium w-24">备注：</span>
                <span className="text-default-800 flex-1">{financialRecord?.remark || '无'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialRecordDetail;