import { useRef } from 'react';
import { X } from 'lucide-react';
import axios from '@/utils/request';
import { showAlert } from '@/components/Alert';

const PaymentConfirm = ({ contract, onSuccess }) => {
    const closeBtnRef = useRef(null);

    const handleConfirm = async () => {
        try {
            await axios.put(`/api/contracts/${contract.id}/payment`);
            closeBtnRef.current?.click();
            if (onSuccess) onSuccess();
            showAlert('确认收款成功', 'success');
        } catch (error) {
            showAlert(error.response?.data?.message || '确认收款失败', 'warning');
            console.error("确认收款失败", error);
        }
    };

    return (
        <div id="contract-payment-modal" className="hs-overlay hidden size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto">
            <div className="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto">
                <div className="flex flex-col bg-white border shadow-sm rounded-xl">
                    <div className="flex justify-between items-center py-3 px-4">
                        <h3 className="font-bold text-gray-800">确认收款</h3>
                        <button ref={closeBtnRef} data-hs-overlay="#contract-payment-modal"><X className="size-5" /></button>
                    </div>
                    <div className="p-4 overflow-y-auto">
                        <p className="text-gray-800">
                            确认已收到学生 <span className="font-bold text-primary">{contract?.student_name}</span> 的报读费用 <span className="font-bold text-danger">￥{contract?.total_due}</span> 吗？
                        </p>
                        <p className="text-sm text-default-500 mt-2">确认后状态将更改为“已收款”，且此操作不可撤销。</p>
                    </div>
                    <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t">
                        <button type="button" className="btn btn-sm bg-default-200 text-default-800 hover:bg-default-300 rounded px-3 py-1.5" data-hs-overlay="#contract-payment-modal">
                            取消
                        </button>
                        <button type="button" className="btn btn-sm bg-primary text-white hover:bg-primary-focus rounded px-3 py-1.5" onClick={handleConfirm}>
                            确认收款
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentConfirm;