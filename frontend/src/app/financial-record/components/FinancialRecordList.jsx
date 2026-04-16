import { Plus, Eye } from 'lucide-react';

const FinancialRecordList = ({ records, onSelectFinancialRecord }) => {
  return (
    <div className="card">
      <div className="card-header flex justify-between items-center">
        <h6 className="card-title">财务流水 ({records.length})</h6>
        <button
          className="btn btn-sm bg-primary text-white flex items-center gap-1"
          data-hs-overlay="#financial-record-add-modal"
        >
          <Plus className="size-4" /> 添加流水
        </button>
      </div>

      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="min-w-full inline-block align-middle">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-default-200">
                <thead className="bg-default-100 font-normal whitespace-nowrap">
                  <tr className="text-sm text-default-800">
                    <th className="px-3 py-3 font-medium text-start">流水号</th>
                    <th className="px-3 py-3 font-medium text-start">交易类型</th>
                    <th className="px-3 py-3 font-medium text-start">类别</th>
                    <th className="px-3 py-3 font-medium text-start">金额 (元)</th>
                    <th className="px-3 py-3 font-medium text-start">校区</th>
                    <th className="px-3 py-3 font-medium text-start">交易时间</th>
                    <th className="px-3 py-3 font-medium text-start">操作人</th>
                    <th className="px-3 py-3 font-medium text-start">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-default-200">
                  {records.length > 0 ? (
                    records.map((record) => (
                      <tr key={record.id} className="text-default-800 font-normal whitespace-nowrap">
                        <td className="px-3 py-3 text-sm text-primary">{record.serial_no}</td>
                        <td className="px-3 py-3 text-sm">
                          <span className={`py-1 px-2 inline-flex items-center text-xs font-medium rounded ${record.trade_type === '收入' ? 'bg-success/10 text-success' : record.trade_type === '支出' ? 'bg-danger/10 text-danger' : 'bg-warning/10 text-warning'}`}>
                            {record.trade_type}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-sm">{record.category}</td>
                        <td className={`px-3 py-3 text-sm font-medium ${record.trade_type === '收入' ? 'text-success' : 'text-danger'}`}>
                          {record.trade_type === '收入' ? '+' : '-'}{record.amount}
                        </td>
                        <td className="px-3 py-3 text-sm">{record.campus_name || '-'}</td>
                        <td className="px-3 py-3 text-sm">{record.created_at}</td>
                        <td className="px-3 py-3 text-sm">{record.operator_name || '-'}</td>
                        <td className="px-3 py-3">
                          <button
                            className="flex size-8 bg-default-200 rounded-md items-center justify-center hover:bg-primary/10 hover:text-primary transition-all text-default-600"
                            onClick={() => onSelectFinancialRecord(record)}
                            data-hs-overlay="#financial-record-details-modal"
                          >
                            <Eye className="size-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="8" className="text-center py-4">暂无流水数据</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default FinancialRecordList;