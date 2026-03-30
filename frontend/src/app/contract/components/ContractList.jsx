import { Plus, Trash2, Eye, BadgeCheck} from 'lucide-react';

const ContractList = ({ contracts, onSelectContract }) => {
  return (
    <div className="card">
      <div className="card-header flex justify-between items-center py-3 px-4 border-b">
        <h6 className="card-title font-semibold text-base text-default-800">
          报名合同列表 ({contracts.length})
        </h6>
        <button
          className="btn btn-sm bg-primary text-white flex items-center gap-1 rounded px-3 py-1.5"
          data-hs-overlay="#contract-add-modal"
        >
          <Plus className="size-4" /> 新建合同
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-default-200">
          <thead className="bg-default-100 font-normal whitespace-nowrap">
            <tr className="text-sm text-default-800">
              <th className="px-4 py-3 font-medium text-start">合同ID</th>
              <th className="px-4 py-3 font-medium text-start">学生</th>
              <th className="px-4 py-3 font-medium text-start">报读课程</th>
              <th className="px-4 py-3 font-medium text-start">课时数</th>
              <th className="px-4 py-3 font-medium text-start">实付金额(￥)</th>
              <th className="px-4 py-3 font-medium text-start">合同余额(￥)</th>
              <th className="px-4 py-3 font-medium text-start">签约日期</th>
              <th className="px-4 py-3 font-medium text-start">状态</th>
              <th className="px-4 py-3 font-medium text-start">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-default-200">
            {contracts.length > 0 ? contracts.map((item) => (
              <tr key={item.id} className="text-default-800 whitespace-nowrap">
                <td className="px-4 py-3 text-sm text-primary">#{item.id}</td>
                <td className="px-4 py-3 text-sm font-medium">{item.student_name}</td>
                <td className="px-4 py-3 text-sm">{item.course_name}</td>
                <td className="px-4 py-3 text-sm">{item.purchased_hours}</td>
                <td className="px-4 py-3 text-sm font-semibold">{item.total_due}</td>
                <td className="px-4 py-3 text-sm font-semibold">{item.account_balance}</td>
                <td className="px-4 py-3 text-sm">{new Date(item.created_at).toLocaleString()}</td>
                <td className="px-4 py-3 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs ${item.status === '已收款' ? 'bg-success/10 text-success' : 'bg-default-200'}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {/* 根据状态条件渲染操作按钮 */}
                    {item.status === '已签约' && (
                      <>
                        <button className="flex size-8 bg-default-200 rounded-md items-center justify-center hover:bg-success/10 hover:text-success text-default-600" onClick={() => onSelectContract(item)} data-hs-overlay="#contract-payment-modal" title="确认收款">
                          <BadgeCheck className="size-4" />
                        </button>
                        <button className="flex size-8 bg-default-200 rounded-md items-center justify-center hover:bg-danger/10 hover:text-danger text-default-600" onClick={() => onSelectContract(item)} data-hs-overlay="#contract-delete-modal" title="删除">
                          <Trash2 className="size-4" />
                        </button>
                      </>
                    )}
                    {(item.status === '已收款' || item.status === '已退费') && (
                      <button className="flex size-8 bg-default-200 rounded-md items-center justify-center hover:bg-info/10 hover:text-info text-default-600" onClick={() => onSelectContract(item)} data-hs-overlay="#contract-detail-modal" title="详情">
                        <Eye className="size-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )) : <tr><td colSpan="8" className="text-center py-4">暂无合同数据</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default ContractList;