import deleteImg from '@/assets/images/delete.png';
import { X } from 'lucide-react';
import axios from '@/utils/request';
import { useRef, useState } from 'react';

const DeleteModal = ({ campusData, onSuccess }) => {
  const closeBtnRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!campusData?.id) return;
    try {
      setLoading(true);
      await axios.delete(`/api/campuses/${campusData.id}`);
      onSuccess();
      closeBtnRef.current?.click();
    } catch (error) {
      alert(error.response?.data?.message || '删除失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="campus-delete-modal" className="hs-overlay hidden size-full fixed top-0 start-0 z-80 overflow-x-hidden overflow-y-auto pointer-events-none" role="dialog" tabIndex={-1} aria-labelledby="campus-delete-modal-label">
      <div className="hs-overlay-animation-target hs-overlay-open:scale-100 hs-overlay-open:opacity-100 scale-95 opacity-0 ease-in-out transition-all duration-200 md:w-sm m-3 mx-auto min-h-[calc(100%-56px)] flex items-center">
        <div className="w-full flex flex-col card shadow-2xs border border-default-200 rounded-xl pointer-events-auto px-6 py-8 relative">
          <div className="absolute top-3 end-3">
            <button type="button" ref={closeBtnRef} className="size-5 text-default-800" aria-label="Close" data-hs-overlay="#campus-delete-modal">
              <span className="sr-only">Close</span>
              <X className="size-5" />
            </button>
          </div>

          <div className="text-center">
            <img src={deleteImg} alt="" className="size-12 mx-auto" />
            <div className="mt-5 text-center">
              <h5 className="mb-1 text-lg font-semibold text-default-800">确认删除?</h5>
              <p className="text-default-500 text-sm font-normal">
                您确定要删除校区 <b>{campusData?.name}</b> 吗？此操作无法撤销。
              </p>
              <div className="mt-5 flex gap-2 justify-center">
                <button data-hs-overlay="#campus-delete-modal" className="btn text-danger bg-transparent hover:bg-danger/10" aria-label="Close">
                  取消
                </button>
                <button onClick={handleDelete} className="bg-danger text-white btn border-0 btn-sm" disabled={loading}>
                  {loading ? '删除中...' : '确认删除'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DeleteModal;