import { useRef, useState, useEffect } from 'react';
import { X, Printer } from 'lucide-react';
import axios from '@/utils/request';
import stampImage from '@/assets/images/receipt-stamp.gif';

const ContractDetail = ({ contract }) => {
  const closeBtnRef = useRef(null);

  // 用于存储查询到的顾问真实姓名
  const [consultantName, setConsultantName] = useState('');

  // 监听 contract.consultant_id 的变化，如果有值则去查询用户表获取 real_name
  useEffect(() => {
    const fetchConsultantName = async () => {
      if (contract?.consultant_id) {
        try {
          // 调用刚刚在后端写好的获取单个用户接口
          const response = await axios.get(`/api/users/${contract.consultant_id}`);
          // 获取 real_name，如果没有则兜底显示未知顾问
          setConsultantName(response.data?.real_name || '未知顾问');
        } catch (error) {
          console.error('获取收款人姓名失败:', error);
          setConsultantName('未知顾问');
        }
      } else {
        setConsultantName('');
      }
    };

    fetchConsultantName();
  }, [contract?.consultant_id]);

  // 安全解析 JSON 字段
  const studentInfo = contract?.student_snapshot || {};
  const courseInfo = contract?.course_snapshot || {};
  const textbooks = contract?.textbook_info || [];
  const discounts = contract?.discount_info || [];
  const groups = contract?.group_info || [];

  // 获取当前地区的日期格式 (例如：2026/02/28)
  const currentDate = new Date().toLocaleDateString('zh-CN');

  // 执行打印动作
  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="contract-detail-modal" className="hs-overlay hidden size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto print:fixed print:inset-0 print:bg-white print:z-[999]">
      <div className="hs-overlay-animation-target max-w-3xl lg:w-full m-3 mx-auto flex items-center min-h-[calc(100%-56px)] print:m-0 print:w-full print:max-w-none print:min-h-0 print:items-start">
        <div className="w-full bg-white card rounded-xl shadow-lg border relative overflow-hidden print:border-none print:shadow-none print:rounded-none">

          <div className="card-header flex justify-between items-center py-3 px-4 border-b bg-gray-50 print:hidden">
            <h3 className="font-semibold text-base text-gray-800">合同凭证预览</h3>
            <button ref={closeBtnRef} type="button" className="text-gray-500 hover:text-gray-800" data-hs-overlay="#contract-detail-modal">
              <X className="size-5" />
            </button>
          </div>

          <div className="p-8 print:p-0 print:pt-8" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
            {contract ? (
              <div className="relative border-2 border-double border-gray-400 p-8 bg-orange-50/20">
                {/* 电子图章 
                    注意：z-index 设为 z-30，绝对定位盖在所有内容之上，
                    配合 mix-blend-multiply (正片叠底) 滤镜，让印章透明区域自然融入背景和表格线 
                */}
                <div className="absolute bottom-4 right-10 z-30 pointer-events-none opacity-90 mix-blend-multiply">
                  <img src={stampImage} alt="公司财务章" className="w-32 h-32 object-contain" />
                </div>

                {/* 凭证头部 */}
                <div className="text-center mb-6 relative z-20">
                  <h2 className="text-3xl font-bold tracking-[0.3em] text-gray-800">收款凭证</h2>
                  <div className="flex justify-between mt-6 text-sm text-gray-600 font-medium">
                    <span>流水单号：{contract.id}</span>
                    <span>创建时间：{contract.created_at ? new Date(contract.created_at).toLocaleString() : '-'}</span>
                  </div>
                </div>

                {/* 凭证表格区，z-index: 20，低于印章的 30 */}
                <table className="w-full border-collapse border border-gray-400 text-sm relative z-20 bg-white/50 backdrop-blur-sm">
                  <tbody>
                    {/* 学生信息 */}
                    <tr>
                      <td className="border border-gray-400 p-3 font-bold text-gray-700 bg-gray-100/50 w-24 text-center">交款人</td>
                      <td className="border border-gray-400 p-3 w-1/3">
                        {studentInfo.name || contract.student_name || '-'}
                      </td>
                      <td className="border border-gray-400 p-3 font-bold text-gray-700 bg-gray-100/50 w-24 text-center">联系电话</td>
                      <td className="border border-gray-400 p-3 w-1/3">
                        {studentInfo.parent_phone || '-'}
                      </td>
                    </tr>

                    {/* 课程信息 */}
                    <tr>
                      <td className="border border-gray-400 p-3 font-bold text-gray-700 bg-gray-100/50 text-center">报名课程</td>
                      <td className="border border-gray-400 p-3" colSpan={3}>
                        <span className="font-semibold">{courseInfo.course_name || contract.course_name || '-'}</span>
                        <span className="ml-4 text-gray-500 text-xs">
                          (标准单价: ￥{courseInfo.unit_price || 0} / {courseInfo.class_period || 0}分钟)
                        </span>
                      </td>
                    </tr>

                    {/* 课时与签约日期 */}
                    <tr>
                      <td className="border border-gray-400 p-3 font-bold text-gray-700 bg-gray-100/50 text-center">购买课时</td>
                      <td className="border border-gray-400 p-3 font-semibold text-blue-600">
                        {contract.purchased_hours} 课时
                      </td>
                      <td className="border border-gray-400 p-3 font-bold text-gray-700 bg-gray-100/50 text-center">签约日期</td>
                      <td className="border border-gray-400 p-3">
                        {/* 展示当前本地格式的日期 */}
                        {currentDate}
                      </td>
                    </tr>

                    {/* 教材信息 */}
                    {textbooks.length > 0 && (
                      <tr>
                        <td className="border border-gray-400 p-3 font-bold text-gray-700 bg-gray-100/50 text-center">教材明细</td>
                        <td className="border border-gray-400 p-3" colSpan={3}>
                          <div className="flex flex-col gap-1">
                            {textbooks.map((item, idx) => (
                              <div key={idx} className="flex justify-between w-2/3 border-b border-gray-200 border-dashed pb-1">
                                <span>{item.book_name}</span>
                                <span>x {item.quantity} (￥{item.unit_price}/本)</span>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}

                    {/* 优惠与团购信息 */}
                    {(discounts.length > 0 || groups.length > 0) && (
                      <tr>
                        <td className="border border-gray-400 p-3 font-bold text-gray-700 bg-gray-100/50 text-center">优惠明细</td>
                        <td className="border border-gray-400 p-3" colSpan={3}>
                          <div className="flex flex-col gap-1 text-green-700">
                            {discounts.map((d, idx) => (
                              <div key={`d-${idx}`}>{d.name}({d.value}{d.suffix}):￥{d.amount}</div>
                            ))}
                            {groups.map((g, idx) => (
                              <div key={`g-${idx}`}>{g.name}({g.value}{g.suffix}): ￥{g.amount}</div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}

                    {/* 备注 */}
                    <tr>
                      <td className="border border-gray-400 p-3 font-bold text-gray-700 bg-gray-100/50 text-center">备注说明</td>
                      <td className="border border-gray-400 p-3 text-gray-600" colSpan={3}>
                        {contract.remark || '无'}
                      </td>
                    </tr>

                    {/* 合计金额 */}
                    <tr>
                      <td className="border border-gray-400 p-4 font-bold text-gray-800 bg-gray-100/50 text-center text-lg">实收总计</td>
                      <td className="border border-gray-400 p-4 text-2xl font-bold text-red-600 tracking-wide" colSpan={3}>
                        ￥{Number(contract.total_due || 0).toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* 底部只展示收款人，并显示通过接口查出的真实姓名 */}
                <div className="flex justify-start mt-8 pl-5 text-sm text-gray-700 font-medium relative z-20">
                  <div>课程顾问：{consultantName || '加载中...'}</div>
                </div>

              </div>
            ) : (
              <div className="p-12 text-center text-gray-400">正在生成凭证中...</div>
            )}
          </div>

          <div className="bg-gray-50 border-t p-4 flex justify-end gap-3 print:hidden">
            <button type="button" onClick={handlePrint} className="btn bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2" >
              <Printer className="size-4" />
              打印凭证
            </button>

            <button type="button" className="btn bg-gray-200 hover:bg-gray-300 text-gray-800" data-hs-overlay="#contract-detail-modal">
              关闭预览
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ContractDetail;