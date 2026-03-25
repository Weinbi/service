import { useRef } from 'react';
import axios from '@/utils/request';
import deleteImg from '@/assets/images/delete.png';
import { X } from 'lucide-react';

const DeleteModal = ({ course, onDeleteSuccess }) => {
  const closeBtnRef = useRef(null);

  const handleDelete = async () => {
    if (!course) return;
    try {
      await axios.delete(`/api/courses/${course.id}`);
      onDeleteSuccess();
      closeBtnRef.current?.click();
    } catch (error) {
      alert('删除失败: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div id="course-delete-modal" className="hs-overlay hidden size-full fixed top-0 start-0 z-80 overflow-x-hidden overflow-y-auto pointer-events-none">
      <div className="hs-overlay-animation-target hs-overlay-open:scale-100 hs-overlay-open:opacity-100 scale-95 opacity-0 ease-in-out transition-all duration-200 md:w-sm m-3 mx-auto min-h-[calc(100%-56px)] flex items-center">
        <div className="w-full flex flex-col card shadow-2xs border border-default-200 rounded-xl pointer-events-auto px-6 py-8 relative bg-white">
          <div className="absolute top-3 end-3">
            <button ref={closeBtnRef} type="button" className="size-5 text-default-800" aria-label="Close" data-hs-overlay="#course-delete-modal">
              <span className="sr-only">Close</span>
              <X className="size-5" />
            </button>
          </div>

          <div className="font-semibold text-base text-default-800 text-center">
            <img src={deleteImg} alt="" className="size-12 mx-auto" />
            <div className="mt-5 text-center">
              <h5 className="mb-1 text-lg font-semibold text-default-800">确认删除?</h5>
              <p className="text-default-500 text-sm font-normal">
                您确定要删除课程 <b>{course?.course_name}</b> 吗？<br />此操作无法撤销。
              </p>
              <div className="mt-5 flex gap-2 justify-center">
                <button data-hs-overlay="#course-delete-modal" className="btn text-danger bg-transparent hover:bg-danger/10">
                  取消
                </button>
                <button onClick={handleDelete} className="bg-danger text-white btn border-0 btn-sm hover:bg-danger-600">
                  确认删除
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