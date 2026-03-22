import { useRef } from 'react';
import axios from '@/utils/request';
import deleleImg from '@/assets/images/delete.png';
import { X } from 'lucide-react';
import { showAlert } from '@/components/Alert';

const UserDelete = ({ user, onDeleteSuccess }) => {
  const closeBtnRef = useRef(null);

  const handleDelete = async () => {
    if (!user) return;
    try {
      await axios.delete(`/api/users/${user.id}`);
      showAlert('删除成功', 'success');
      onDeleteSuccess();
      closeBtnRef.current?.click();
    } catch (error) {
      showAlert(error.response?.data?.message || error.message || '删除失败', 'danger');
    }
  };

  return (
    <div id="user-delete-modal" className="hs-overlay hidden size-full fixed top-0 start-0 z-80 overflow-x-hidden overflow-y-auto pointer-events-none">
      <div className="hs-overlay-animation-target hs-overlay-open:scale-100 hs-overlay-open:opacity-100 scale-95 opacity-0 ease-in-out transition-all duration-200 md:w-sm m-3 mx-auto min-h-[calc(100%-56px)] flex items-center">
        <div className="w-full flex flex-col card shadow-2xs border border-default-200 rounded-xl pointer-events-auto px-6 py-8 relative bg-white">
          <div className="absolute top-3 end-3">
            <button type="button" className="size-5 text-default-800" ref={closeBtnRef} aria-label="Close" data-hs-overlay="#user-delete-modal">
              <X className="size-5" />
            </button>
          </div>
          <div className="text-center">
            <img src={deleleImg} alt="" className="size-12 mx-auto" />
            <h5 className="mb-1 text-lg font-semibold text-default-800 mt-5">确认删除?</h5>
            <p className="text-default-500 text-sm font-normal">
              您确定要删除用户 <b>{user?.real_name}</b> 吗？此操作无法撤销。
            </p>
            <div className="mt-5 flex gap-2 justify-center">
              <button className="btn text-default-600 bg-transparent hover:bg-default-100" data-hs-overlay="#user-delete-modal">取消</button>
              <button className="btn bg-danger text-white px-4 py-2 rounded" onClick={handleDelete}>确认删除</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDelete;