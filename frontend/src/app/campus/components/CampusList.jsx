import { useEffect, useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from '@/utils/request';

const CampusList = ({ refreshKey, onEdit, onDelete }) => {
  const [campusData, setCampusData] = useState([]);
  const [loading, setLoading] = useState(true);

  // 获取数据
  const fetchCampuses = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/campuses');
      setCampusData(res.data);
    } catch (error) {
      console.error("Failed to fetch campuses", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampuses();
  }, [refreshKey]);

  return (
    <div className="card">
      <div className="card-header flex justify-between items-center">
        <h6 className="card-title">校区列表</h6>
        <button
          className="btn btn-sm bg-primary text-white flex items-center gap-1"
          aria-haspopup="dialog"
          aria-expanded="false"
          aria-controls="campus-add-modal"
          data-hs-overlay="#campus-add-modal"
        >
          <Plus className="size-4" /> 添加校区
        </button>
      </div>

      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="min-w-full inline-block align-middle">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-default-200">
                <thead className="font-semibold whitespace-nowrap">
                  <tr className="text-sm text-default-800 divide-x divide-default-200">
                    <th className="px-3 py-3 text-start">ID</th>
                    <th className="px-3 py-3 text-start">校区名称</th>
                    <th className="px-3 py-3 text-start">地址</th>
                    <th className="px-3 py-3 text-start">状态</th>
                    <th className="px-3 py-3 text-start">创建时间</th>
                    <th className="px-3 py-3 text-start">操作</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-default-200">
                  {loading ? (
                    <tr><td colSpan="6" className="text-center py-4">加载中...</td></tr>
                  ) : campusData.map(campus => (
                    <tr key={campus.id} className="text-default-800 font-normal whitespace-nowrap divide-x divide-default-200">
                      <td className="px-3 py-3 text-sm">{campus.id}</td>
                      <td className="px-3 py-3 text-sm font-medium">{campus.name}</td>
                      <td className="px-3 py-3 text-sm">{campus.address || '-'}</td>
                      <td className="px-3 py-3 text-sm">
                        <span className={`px-2 py-1 rounded text-xs ${campus.status === '营业中' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {campus.status}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-sm">
                        {new Date(campus.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onEdit(campus)}
                            className="btn size-8 bg-default-200 hover:bg-primary/10 hover:text-primary text-default-600 flex items-center justify-center rounded"
                            aria-haspopup="dialog"
                            aria-expanded="false"
                            aria-controls="campus-edit-modal"
                            data-hs-overlay="#campus-edit-modal"
                          >
                            <Pencil className="size-4" />
                          </button>

                          <button
                            onClick={() => onDelete(campus)}
                            className="btn size-8 bg-default-200 hover:bg-danger/10 hover:text-danger text-default-600 flex items-center justify-center rounded"
                            aria-haspopup="dialog"
                            aria-expanded="false"
                            aria-controls="campus-delete-modal"
                            data-hs-overlay="#campus-delete-modal"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!loading && campusData.length === 0 && (
                    <tr><td colSpan="6" className="text-center py-4">暂无数据</td></tr>
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
export default CampusList;