import { Plus, SquarePen, Trash2, Eye, BookOpen } from 'lucide-react';

const TextbookList = ({ textbooks, onSelectTextbook }) => {
  return (
    <div className="card">
      <div className="card-header flex justify-between items-center py-3 px-4 border-b">
        <h6 className="card-title font-semibold text-base text-default-800">
          教材种类 ({textbooks.length})
        </h6>
        <button 
          className="btn btn-sm bg-primary text-white flex items-center gap-1 rounded px-3 py-1.5"
          data-hs-overlay="#textbook-add-modal"
        >
          <Plus className="size-4" /> 添加教材
        </button>
      </div>

      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="min-w-full inline-block align-middle">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-default-200">
                <thead className="bg-default-100 font-normal whitespace-nowrap">
                  <tr className="text-sm text-default-800">
                    <th className="px-4 py-3 font-medium text-start">教材ID</th>
                    <th className="px-4 py-3 font-medium text-start">书名</th>
                    <th className="px-4 py-3 font-medium text-start">所属校区</th>
                    <th className="px-4 py-3 font-medium text-start">库存总量</th>
                    <th className="px-4 py-3 font-medium text-start">预定未领</th>
                    <th className="px-4 py-3 font-medium text-start">单价 (￥)</th>
                    <th className="px-4 py-3 font-medium text-start">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-default-200">
                  {textbooks.length > 0 ? (
                    textbooks.map((item) => (
                      <tr key={item.id} className="text-default-800 font-normal whitespace-nowrap">
                        <td className="px-4 py-3 text-sm text-primary">#{item.id}</td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center gap-2">
                            <BookOpen className="size-4 text-default-400" />
                            <span className="font-medium">{item.book_name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">{item.campus_name || '-'}</td>
                        <td className="px-4 py-3 text-sm">{item.stock}</td>
                        <td className="px-4 py-3 text-sm text-warning">{item.reserved_quantity}</td>
                        <td className="px-4 py-3 text-sm">{item.unit_price}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              className="flex size-8 bg-default-200 rounded-md items-center justify-center hover:bg-info/10 hover:text-info transition-all text-default-600"
                              onClick={() => onSelectTextbook(item)}
                              data-hs-overlay="#textbook-detail-modal"
                              title="详情记录"
                            >
                              <Eye className="size-4" />
                            </button>
                            <button
                              className="flex size-8 bg-default-200 rounded-md items-center justify-center hover:bg-primary/10 hover:text-primary transition-all text-default-600"
                              onClick={() => onSelectTextbook(item)}
                              data-hs-overlay="#textbook-edit-modal"
                              title="编辑"
                            >
                              <SquarePen className="size-4" />
                            </button>
                            <button
                              className="flex size-8 bg-default-200 rounded-md items-center justify-center hover:bg-danger/10 hover:text-danger transition-all text-default-600"
                              onClick={() => onSelectTextbook(item)}
                              data-hs-overlay="#textbook-delete-modal"
                              title="删除"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="7" className="text-center py-4">暂无教材数据</td></tr>
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
export default TextbookList;