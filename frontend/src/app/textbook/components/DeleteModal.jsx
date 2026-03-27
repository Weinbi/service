import { useRef } from 'react';
import axios from '@/utils/request';
import { X, AlertTriangle } from 'lucide-react';

const DeleteModal = ({ textbook, onDeleteSuccess }) => {
  const closeBtnRef = useRef(null);

  const handleDelete = async () => {
    if (!textbook) return;
    try {
      await axios.delete(`/api/textbooks/${textbook.id}`);
      onDeleteSuccess();
      closeBtnRef.current?.click();
    } catch (error) {
      alert('删除失败: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div id="textbook-delete-modal" className="hs-overlay hidden size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto pointer-events-none">
      <div className="hs-overlay-animation-target hs-overlay-open:scale-100 hs-overlay-open:opacity-100 scale-95 opacity-0 ease-in-out transition-all duration-200 max-w-md lg:w-full m-3 mx-auto min-h-[calc(100%-56px)] flex items-center justify-center">
        <div className="w-full flex flex-col card border border-default-200 shadow-2xs rounded-xl pointer-events-auto bg-white">
          <div className="card-header flex justify-between items-center py-3 px-4 border-b">
            <h3 className="font-semibold text-base text-danger flex items-center gap-2">
              <AlertTriangle className="size-5" />
              确认删除
            </h3>
            <button type="button" ref={closeBtnRef} aria-label="Close" data-hs-overlay="#textbook-delete-modal">
              <X className="size-5" />
            </button>
          </div>
          
          <div className="card-body p-4 text-center">
            <p className="text-default-600 mb-4">
              确定要删除教材 <strong>{textbook?.book_name}</strong> 吗？<br />
              此操作无法撤销。
            </p>
            <div className="flex justify-center gap-2">
              <button type="button" className="btn bg-default-200 text-default-800 px-4 py-2 rounded" data-hs-overlay="#textbook-delete-modal">取消</button>
              <button type="button" className="btn bg-danger text-white px-4 py-2 rounded" onClick={handleDelete}>确定删除</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;