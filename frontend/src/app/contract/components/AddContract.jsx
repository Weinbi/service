import { useState, useEffect, useRef } from 'react';
import axios from '@/utils/request';
import { X } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import Flatpickr from 'react-flatpickr';
import { Mandarin } from 'flatpickr/dist/l10n/zh.js'
import { showAlert } from '@/components/Alert';

const AddContract = ({ onAddSuccess }) => {
  const closeBtnRef = useRef(null);
  const [campuses, setCampuses] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [preview, setPreview] = useState(null);

  const { register, handleSubmit, control, watch, setValue, reset, formState: { errors } } = useForm({
    defaultValues: {
      selected_textbooks: {},
      group_name: '',
      contract_date: [new Date()] // 默认今天
    }
  });

  const watchStudentId = watch("student_id");
  const watchCourseId = watch("course_id");
  const watchHours = watch("purchased_hours");
  const watchGroupName = watch("group_name");
  const watchTextbooks = watch("selected_textbooks");

  // 初始化基础数据
  useEffect(() => {
    axios.get('/api/campuses').then(res => setCampuses(res.data));
    axios.get('/api/students').then(res => setStudents(res.data));
    axios.get('/api/courses').then(res => setCourses(res.data));
  }, []);

  // 触发算价预览
  useEffect(() => {
    if (watchStudentId && watchCourseId && watchHours > 0) {
      axios.post('/api/contracts/preview', {
        studentId: watchStudentId.value,
        courseId: watchCourseId,
        purchasedHours: Number(watchHours),
        groupName: watchGroupName
      }).then(res => {
        const data = res.data.data;
        setPreview(data);

        // 自动勾选全部教材并初始化数量为 1 (移除了 tb.is_mandatory 逻辑)
        let initBooks = { ...watchTextbooks };
        data.textbooks.forEach(tb => {
          if (!initBooks[tb.id]) {
            initBooks[tb.id] = { selected: true, quantity: 1 };
          }
        });
        setValue('selected_textbooks', initBooks);
      }).catch(console.error);
    } else {
      setPreview(null);
    }
  }, [watchStudentId, watchCourseId, watchHours, watchGroupName]);

  // 计算实付总额
  const calculateTotal = () => {
    if (!preview) return 0;
    let tuition = preview.discountedPrice;
    let textbookFee = 0;

    if (watchTextbooks) {
      preview.textbooks.forEach(tb => {
        const tbState = watchTextbooks[tb.id];
        if (tbState && tbState.selected) {
          textbookFee += (Number(tb.unit_price) * (Number(tbState.quantity) || 1));
        }
      });
    }
    return {
      tuition,
      textbookFee,
      total: (tuition + textbookFee).toFixed(2)
    };
  };

  const onSubmit = async (data) => {
    const feeInfo = calculateTotal();

    // 过滤出选中的教材详情
    const selectedTbs = [];
    if (preview && data.selected_textbooks) {
      preview.textbooks.forEach(tb => {
        if (data.selected_textbooks[tb.id]?.selected) {
          selectedTbs.push({ id: tb.id, quantity: Number(data.selected_textbooks[tb.id].quantity) || 1 });
        }
      });
    }

    // 处理同行人数据，合并为对象数组格式
    let peerStudents = null;
    if (data.peer_student) {
      // 多选模式
      peerStudents = data.peer_student.map(item => ({
        id: item.value,
        name: item.label.split(' - ')[0]
      }));
    }

    const payload = {
      ...data,
      student_id: data.student_id.value,
      discountInfo: preview.discountInfo,
      groupInfo: preview.groupInfo,
      peer_students: peerStudents,
      contract_date: data.contract_date[0].toISOString().split('T')[0],
      selected_textbooks: selectedTbs,
      calculatedTuition: feeInfo.tuition,
      textbookFee: feeInfo.textbookFee,
      total_due: feeInfo.total
    };
    delete payload.peer_student;
    
    try {
      await axios.post('/api/contracts', payload);
      onAddSuccess();
      reset();
      closeBtnRef.current?.click();
      showAlert('添加成功', 'success');
    } catch (error) {
      showAlert(error.response?.data?.message || '添加失败', 'warning');
    }
  };

  const studentOptions = students.map(s => ({ value: s.id, label: `${s.name} - ${s.parent_phone}` }));

  // 解析选中课程的团购方案，用来动态控制渲染
  const selectedCourseData = courses.find(c => String(c.id) === String(watchCourseId));
  let availableGroupSchemes = [];
  if (selectedCourseData?.group_scheme) {
    try {
      availableGroupSchemes = typeof selectedCourseData.group_scheme === 'string'
        ? JSON.parse(selectedCourseData.group_scheme)
        : selectedCourseData.group_scheme;
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div id="contract-add-modal" className="hs-overlay hidden size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto">
      <div className="hs-overlay-animation-target max-w-4xl lg:w-full m-3 mx-auto flex items-center min-h-[calc(100%-56px)]">
        <div className="w-full bg-white card rounded-xl shadow-lg">
          <div className="card-header flex justify-between items-center py-3 px-4 border-b">
            <h3 className="font-semibold text-base">新建报名合同</h3>
            <button ref={closeBtnRef} data-hs-overlay="#contract-add-modal"><X className="size-5" /></button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium">选择学生 *</label>
                <Controller
                  name="student_id" control={control} rules={{ required: "请选择学生" }}
                  render={({ field }) => <Select {...field} options={studentOptions} placeholder="搜索学生姓名/手机" isClearable />}
                />
                {errors.student_id && <span className="text-xs text-danger">{errors.student_id.message}</span>}
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">所属校区 *</label>
                <select className="form-input w-full border rounded p-2 text-sm" {...register("campus_id", { required: "必选" })}>
                  <option value="">-- 请选择 --</option>
                  {campuses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                {errors.campus_id && <span className="text-xs text-danger">{errors.campus_id.message}</span>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium">报读课程 *</label>
                <select className="form-input w-full border rounded p-2 text-sm" {...register("course_id", { required: "必选" })}>
                  <option value="">-- 选择课程 --</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.course_name}</option>)}
                </select>
                {errors.course_id && <span className="text-xs text-danger">{errors.course_id.message}</span>}
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">购买课时 *</label>
                <input type="number" min="1" className="form-input w-full border rounded p-2 text-sm" {...register("purchased_hours", { required: "必填" })} />
                {errors.purchased_hours && <span className="text-xs text-danger">{errors.purchased_hours.message}</span>}
              </div>
            </div>

            {/* 动态团购选项显示区 */}
            {watchCourseId && availableGroupSchemes.length > 0 && (
              <div className="p-3 bg-default-50 border border-default-200 rounded mt-2">
                <p className="text-sm font-medium mb-2">团购方案</p>
                <div className="flex gap-4">
                  <label className="text-sm flex items-center gap-1">
                    <input type="radio" value="" {...register('group_name')} /> 不参与
                  </label>

                  {/* 根据课程包含的方案，动态渲染所有的团购单选框 */}
                  {availableGroupSchemes.map((g, idx) => (
                    <label key={idx} className="text-sm flex items-center gap-1">
                      <input type="radio" value={g.name} {...register('group_name')} /> {g.name}
                    </label>
                  ))}
                </div>

                {watchGroupName === '线上团购' && (
                  <div className="mt-3">
                    <input type="text" placeholder="请填写线上平台核销码 *" className="form-input w-full md:w-1/2 border rounded p-2 text-sm"
                      {...register('verify_code', { required: watchGroupName === '线上团购' ? "核销码必填" : false })} />
                    {errors.verify_code && <span className="text-xs text-danger block mt-1">{errors.verify_code.message}</span>}
                  </div>
                )}

                {watchGroupName === '线下团购' && (
                  <div className="mt-3 md:w-1/2">
                    <Controller
                      name="peer_student" control={control} rules={{ required: watchGroupName === '线下团购' ? "请关联同行人" : false }}
                      render={({ field }) => <Select {...field} isMulti options={studentOptions} placeholder="搜索同行人姓名/手机" isClearable />}
                    />
                    {errors.peer_student && <span className="text-xs text-danger block mt-1">{errors.peer_student.message}</span>}
                  </div>
                )}
              </div>
            )}

            {/* 报价与教材 Table */}
            {preview && (
              <div className="border rounded mt-4 overflow-hidden">
                <table className="min-w-full divide-y divide-default-200">
                  <thead className="bg-default-100">
                    <tr className="text-sm">
                      <th className="px-4 py-2 text-left font-medium">收费项目</th>
                      <th className="px-4 py-2 text-left font-medium">原价/单价</th>
                      <th className="px-4 py-2 text-left font-medium">数量/说明</th>
                      <th className="px-4 py-2 text-right font-medium">小计</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-default-200">
                    <tr className="text-sm">
                      <td className="px-4 py-3">学费 ({preview.course_price}元/课时)</td>
                      <td className="px-4 py-3">￥{preview.course_price}</td>
                      <td className="px-4 py-3">{watchHours} 课时</td>
                      <td className="px-4 py-3 text-right">￥{preview.basePrice}</td>
                    </tr>

                    {/* 折扣明细 */}
                    {preview.discountInfo.map((d, i) => (
                      <tr key={'d' + i} className="text-sm text-success bg-success/5">
                        <td className="px-4 py-2" colSpan="3">系统优惠: {d.name}</td>
                        <td className="px-4 py-2 text-right">- ￥{d.amount}</td>
                      </tr>
                    ))}
                    {preview.groupInfo.map((g, i) => (
                      <tr key={'g' + i} className="text-sm text-info bg-info/5">
                        <td className="px-4 py-2" colSpan="3">团购立减: {g.name}</td>
                        <td className="px-4 py-2 text-right">- ￥{g.amount}</td>
                      </tr>
                    ))}

                    {/* 教材 */}
                    {preview.textbooks.map(tb => {
                      const tbState = watchTextbooks?.[tb.id] || {};
                      const isSelected = !!tbState.selected;
                      const subtotal = isSelected ? (tb.unit_price * (tbState.quantity || 1)) : 0;

                      return (
                        <tr key={tb.id} className="text-sm">
                          <td className="px-4 py-2 flex items-center gap-2">
                            <input
                              type="checkbox"
                              {...register(`selected_textbooks.${tb.id}.selected`)}
                            />
                            {tb.book_name}
                          </td>
                          <td className="px-4 py-2">￥{tb.unit_price}</td>
                          <td className="px-4 py-2">
                            <input
                              type="number" min="1" step="1" disabled={!isSelected}
                              className="border rounded px-2 py-1 w-20 text-sm disabled:bg-default-100"
                              {...register(`selected_textbooks.${tb.id}.quantity`, {
                                valueAsNumber: true,
                                min: 1,
                                validate: value => Number.isInteger(value) || "需为整数"
                              })}
                              defaultValue={1}
                            />
                            {errors?.selected_textbooks?.[tb.id]?.quantity && <span className="text-xs text-danger block mt-1">{errors.selected_textbooks[tb.id].quantity.message}</span>}
                          </td>
                          <td className="px-4 py-2 text-right">￥{subtotal.toFixed(2)}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
                <div className="bg-default-50 p-4 text-right border-t">
                  <span className="text-sm text-default-600 mr-4">折后学费: ￥{calculateTotal().tuition} | 教材费: ￥{calculateTotal().textbookFee}</span>
                  <p className="text-xl font-bold text-primary inline-block">实付总额: ￥{calculateTotal().total}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium">签约日期 *</label>
                <Controller
                  name="contract_date" control={control} rules={{ required: "请选择签约日期" }}
                  render={({ field }) => <Flatpickr className="form-input w-full border rounded p-2 text-sm" options={{ dateFormat: "Y-m-d", locale: Mandarin }} value={field.value} onChange={field.onChange} />}
                />
                {errors.contract_date && <span className="text-xs text-danger">{errors.contract_date.message}</span>}
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">备注 (收款方式、交易单号等)</label>
                <input type="text" className="form-input w-full border rounded p-2 text-sm" {...register("remark", { required: "必填" })} />
                {errors.remark && <span className="text-xs text-danger">{errors.remark.message}</span>}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t mt-4">
              <button type="button" className="btn bg-default-200 text-default-800" onClick={() => reset()} data-hs-overlay="#contract-add-modal">取消</button>
              <button type="submit" className="btn bg-primary text-white">确认提交</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default AddContract;