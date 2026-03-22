import { useRef } from 'react';
import { X } from 'lucide-react';
import deleleImg from '@/assets/images/delete.png';
import axios from '@/utils/request';
import { showAlert } from '@/components/Alert';

const DeleteModal = ({ role, onDeleteSuccess }) => {
  const closeBtnRef = useRef(null);

  const handleDelete = async () => {
    if (!role) return;
    try {
      await axios.delete(`/api/roles/${role.id}`);
      onDeleteSuccess();
      closeBtnRef.current?.click();
      showAlert('删除成功', 'success');
    } catch (error) {
      showAlert('删除失败: ' + (error.response?.data?.message || error.message), 'danger');
    }
  };

  return (
    <div id="role-delete-modal" className="hs-overlay hidden size-full fixed top-0 start-0 z-80 overflow-x-hidden overflow-y-auto pointer-events-none" role="dialog" tabIndex={-1} aria-labelledby="employeeDelete-label">
      <div className="hs-overlay-animation-target hs-overlay-open:scale-100 hs-overlay-open:opacity-100 scale-95 opacity-0 ease-in-out transition-all duration-200 md:w-sm m-3 mx-auto min-h-[calc(100%-56px)] flex items-center">
        <div className="w-full flex flex-col card shadow-2xs border border-default-200 rounded-xl pointer-events-auto px-6 py-8 relative">
          <div className="absolute top-3 end-3">
            <button type="button" ref={closeBtnRef} className="size-5 text-default-800" aria-label="Close" data-hs-overlay="#role-delete-modal">
              <span className="sr-only">Close</span>
              <X className="size-5" />
            </button>
          </div>
          <h3 className="font-semibold text-base text-default-800  text-center">
            <img src={deleleImg} alt="" className="size-12 mx-auto" />
            <div className="mt-5 text-center">
              <h5 className="mb-1 text-lg font-semibold text-default-800">确定要删除角色 <span className="text-primary">"{role?.role_name}"</span> 吗？</h5>
              <p className="text-default-500 text-sm font-normal">
                此操作不可逆。如果该角色下已经有关联用户，将无法删除。
              </p>
              <div className="mt-5 flex gap-2 justify-center">
                <button className="btn text-danger bg-transparent hover:bg-danger/10" aria-label="Close" data-hs-overlay="#role-delete-modal">
                  取消
                </button>
                <button onClick={handleDelete} className="btn bg-danger text-white">确认删除</button>
              </div>
            </div>
          </h3>
        </div>
      </div>
    </div>
  );
};
export default DeleteModal;