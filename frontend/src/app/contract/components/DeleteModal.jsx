import { useRef } from 'react';
import axios from '@/utils/request';
import { AlertTriangle, X } from 'lucide-react';
import { showAlert } from '@/components/Alert';

const DeleteModal = ({ contract, onDeleteSuccess }) => {
  const closeBtnRef = useRef(null);

  const handleDelete = async () => {
    if (!contract) return;
    try {
      await axios.delete(`/api/contracts/${contract.id}`);
      onDeleteSuccess();
      closeBtnRef.current?.click();
      showAlert('删除成功', 'success');
    } catch (error) {
      showAlert(error.response?.data?.message || '删除失败', 'warning');
    }
  };

  return (
    <div id="contract-delete-modal" className="hs-overlay hidden size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto">
      <div className="hs-overlay-animation-target max-w-sm lg:w-full m-3 mx-auto flex items-center min-h-[calc(100%-56px)]">
        <div className="w-full bg-white card rounded-xl shadow-lg">
          <div className="card-header flex justify-between items-center py-3 px-4 border-b">
            <h3 className="font-semibold text-base flex items-center gap-2"><AlertTriangle className="text-warning size-5" /> 删除确认</h3>
            <button ref={closeBtnRef} type="button" data-hs-overlay="#contract-delete-modal"><X className="size-5" /></button>
          </div>
          <div className="p-4">
            {contract ? (
              <>
                <p className="text-sm text-default-600">确定要删除合同 <strong>#{contract.id}</strong> ({contract.student_name} - {contract.course_name}) 吗？此操作不可恢复。</p>
                <div className="flex justify-end gap-2 mt-4">
                  <button type="button" className="btn bg-default-200 text-default-800" data-hs-overlay="#contract-delete-modal">取消</button>
                  <button type="button" className="btn bg-danger text-white" onClick={handleDelete}>确认删除</button>
                </div>
              </>
            ) : (
              <div className="text-center text-sm text-default-500 py-4">未选择数据...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default DeleteModal;