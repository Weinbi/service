import { useState, useEffect, useRef } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import axios from '@/utils/request';
import { showAlert } from '@/components/Alert';

const EditCourse = ({ course, onUpdateSuccess }) => {
  const closeBtnRef = useRef(null);
  const [textbooks, setTextbooks] = useState([]);
  const [refundRefs, setRefundRefs] = useState([]);

  const { register, control, handleSubmit, reset, watch, formState: { errors } } = useForm({
    defaultValues: {
      textbook_config: [],
      discount_scheme: [],
      group_scheme: [],
      performance_scheme: [],
      refund_scheme: []
    }
  });

  const { fields: textbookFields, append: appendTextbook, remove: removeTextbook } = useFieldArray({
    control, name: "textbook_config"
  });
  const { fields: discountFields, append: appendDiscount, remove: removeDiscount } = useFieldArray({
    control, name: "discount_scheme"
  });
  const { fields: groupFields, append: appendGroup, remove: removeGroup } = useFieldArray({
    control, name: "group_scheme"
  });
  const { fields: performanceFields, append: appendPerformance, remove: removePerformance } = useFieldArray({
    control, name: "performance_scheme"
  });
  const { fields: refundFields, append: appendRefund, remove: removeRefund } = useFieldArray({
    control, name: "refund_scheme"
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [textbooksRes, refsRes] = await Promise.all([
          axios.get('/api/textbooks'),
          axios.get('/api/statistics/referenceDict').catch(() => ({ data: [] }))
        ]);
        setTextbooks(textbooksRes.data);
        setRefundRefs((refsRes.data || []).filter(item => item.category === 'refund'));
      } catch (error) {
        console.error('获取初始数据失败:', error);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (course) {
      let tConfig = course.textbook_config || [];
      if (typeof tConfig === 'string') {
        try { tConfig = JSON.parse(tConfig); } catch (e) { tConfig = []; }
      }

      let dScheme = course.discount_scheme || [];
      if (typeof dScheme === 'string') {
        try { dScheme = JSON.parse(dScheme); } catch (e) { dScheme = []; }
      }

      let gScheme = course.group_scheme || [];
      if (typeof gScheme === 'string') {
        try { gScheme = JSON.parse(gScheme); } catch (e) { gScheme = []; }
      }

      let pScheme = course.performance_scheme || [];
      if (typeof pScheme === 'string') {
        try { pScheme = JSON.parse(pScheme); } catch (e) { pScheme = []; }
      }

      let rScheme = course.refund_scheme || [];
      if (typeof rScheme === 'string') {
        try { rScheme = JSON.parse(rScheme); } catch (e) { rScheme = []; }
      }

      reset({
        course_name: course.course_name,
        class_period: course.class_period,
        unit_price: course.unit_price,
        textbook_config: tConfig,
        discount_scheme: dScheme,
        group_scheme: gScheme,
        performance_scheme: pScheme, // 新增：回填绩效方案
        refund_scheme: rScheme
      });
    }
  }, [course, reset]);

  const onSubmit = async (data) => {
    if (!course) return;
    try {
      await axios.put(`/api/courses/${course.id}`, data);
      onUpdateSuccess();
      closeBtnRef.current?.click();
      showAlert('更新成功', 'success');
    } catch (error) {
      showAlert('更新失败: ' + (error.response?.data?.message || error.message), 'warning');
    }
  };

  return (
    <div id="course-edit-modal" className="hs-overlay hidden size-full fixed top-0 start-0 z-80 overflow-x-hidden overflow-y-auto pointer-events-none">
      <div className="hs-overlay-animation-target hs-overlay-open:scale-100 hs-overlay-open:opacity-100 scale-95 opacity-0 ease-in-out transition-all duration-200 sm:max-w-2xl sm:w-full m-3 sm:mx-auto min-h-[calc(100%-56px)] flex items-center">
        <div className="w-full flex flex-col card border border-default-200 shadow-2xs rounded-xl pointer-events-auto bg-white max-h-[90vh]">
          <div className="card-header flex justify-between items-center py-3 px-4 border-b shrink-0">
            <h3 className="font-bold text-default-800 text-base">编辑课程</h3>
            <button type="button" ref={closeBtnRef} className="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200" aria-label="Close" data-hs-overlay="#course-edit-modal">
              <X className="size-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="overflow-hidden flex flex-col">
            <div className="p-4 overflow-y-auto grid gap-6">
              {/* 基础信息 */}
              <div className="grid gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium">课程名称 <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-input w-full border rounded p-2 text-sm"
                    {...register("course_name", { required: "课程名称不能为空" })}
                  />
                  {errors.course_name && <span className="text-xs text-danger">{errors.course_name.message}</span>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium">时长 (分钟) <span className="text-danger">*</span></label>
                    <input
                      type="number"
                      className="form-input w-full border rounded p-2 text-sm"
                      {...register("class_period", { required: "需填时长", valueAsNumber: true, min: 1 })}
                    />
                    {errors.class_period && <span className="text-xs text-danger">{errors.class_period.message}</span>}
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium">标准单价 (元) <span className="text-danger">*</span></label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-input w-full border rounded p-2 text-sm"
                      {...register("unit_price", { required: "需填单价", valueAsNumber: true, min: 0 })}
                    />
                    {errors.unit_price && <span className="text-xs text-danger">{errors.unit_price.message}</span>}
                  </div>
                </div>
              </div>

              {/* 教材配置 */}
              <div className="border border-default-200 rounded-lg p-4 bg-gray-50/50">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-gray-800">教材配置</label>
                  <button type="button" onClick={() => appendTextbook({ textbook_id: '' })} className="btn btn-sm bg-primary/10 text-primary hover:bg-primary/20 flex items-center gap-1 text-xs py-1 px-2 rounded">
                    <Plus className="size-3" /> 新增教材
                  </button>
                </div>
                {textbookFields.map((item, index) => {
                  const selectedId = watch(`textbook_config.${index}.textbook_id`);
                  const selectedTb = textbooks.find(tb => tb.id === selectedId);

                  return (
                    <div key={item.id} className="flex items-center gap-3 my-2 bg-white p-2 rounded border border-default-100 shadow-sm">
                      <div className="flex-1">
                        <select
                          className="form-input w-full border rounded px-2 text-sm"
                          {...register(`textbook_config.${index}.textbook_id`, { valueAsNumber: true, required: true })}
                        >
                          <option value="">请选择教材</option>
                          {textbooks.map(tb => (
                            <option key={tb.id} value={tb.id}>{tb.book_name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="w-20 text-sm font-medium text-gray-500 text-center">
                        {selectedTb ? `￥${selectedTb.unit_price || 0}` : '-'}
                      </div>

                      <button type="button" onClick={() => removeTextbook(index)} className="text-danger hover:bg-danger/10 p-1 rounded">
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* 折扣方案 */}
              <div className="border border-default-200 rounded-lg p-4 bg-gray-50/50">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-gray-800">折扣方案</label>
                  <button type="button" onClick={() => appendDiscount({ name: "", value: 0, suffix: "%", condition: { end_date: "", min_hours: 0, student_status: "新线索" } })} className="btn btn-sm bg-primary/10 text-primary hover:bg-primary/20 flex items-center gap-1 text-xs py-1 px-2 rounded">
                    <Plus className="size-3" /> 新增折扣
                  </button>
                </div>
                {discountFields.map((item, index) => (
                  <div key={item.id} className="grid grid-cols-12 gap-3 my-3 bg-white p-3 rounded border border-default-100 shadow-sm relative pr-10">
                    <div className="col-span-12 sm:col-span-6">
                      <label className="text-xs text-gray-500 mb-1 block">方案名称</label>
                      <input type="text" placeholder="如: 暑期连报8折" className="form-input w-full border rounded py-1 px-2 text-sm" {...register(`discount_scheme.${index}.name`)} />
                    </div>
                    {/* 折扣值合并了输入与下拉单位选择 */}
                    <div className="col-span-12 sm:col-span-6">
                      <label className="text-xs text-gray-500 mb-1 block">折扣值</label>
                      <div className="flex">
                        <input type="number" step="0.01" placeholder="值" className="form-input w-full border border-r-0 rounded-l py-1 px-2 text-sm focus:z-10" {...register(`discount_scheme.${index}.value`, { valueAsNumber: true })} />
                        <select className="form-select border rounded-r px-2 text-sm bg-gray-50 focus:z-10 w-20 shrink-0" {...register(`discount_scheme.${index}.suffix`)}>
                          <option value="%">%</option>
                          <option value="元">元</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-span-12 sm:col-span-4">
                      <label className="text-xs text-gray-500 mb-1 block">条件: 截止日期</label>
                      <input type="date" className="form-input w-full border rounded py-1 px-2 text-sm" {...register(`discount_scheme.${index}.condition.end_date`)} />
                    </div>
                    <div className="col-span-6 sm:col-span-4">
                      <label className="text-xs text-gray-500 mb-1 block">条件: 最低课时</label>
                      <input type="number" className="form-input w-full border rounded py-1 px-2 text-sm" {...register(`discount_scheme.${index}.condition.min_hours`, { valueAsNumber: true })} />
                    </div>
                    <div className="col-span-6 sm:col-span-4">
                      <label className="text-xs text-gray-500 mb-1 block">条件: 学生状态</label>
                      <select
                        className="form-input w-full border rounded px-2 text-sm"
                        {...register(`discount_scheme.${index}.condition.student_status`)}
                      >
                        <option value="新线索">新线索</option>
                        <option value="已试听">已试听</option>
                        <option value="已转化">已转化</option>
                      </select>
                    </div>
                    <button type="button" onClick={() => removeDiscount(index)} className="absolute top-1/2 -translate-y-1/2 right-3 text-danger hover:bg-danger/10 p-1 rounded">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* 团购方案 */}
              <div className="border border-default-200 rounded-lg p-4 bg-gray-50/50">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-gray-800">团购方案</label>
                  <button type="button" onClick={() => appendGroup({ name: "线上团购", value: 0, suffix: "%" })} className="btn btn-sm bg-primary/10 text-primary hover:bg-primary/20 flex items-center gap-1 text-xs py-1 px-2 rounded">
                    <Plus className="size-3" /> 新增团购
                  </button>
                </div>
                {groupFields.map((item, index) => (
                  <div key={item.id} className="grid grid-cols-12 gap-3 my-3 bg-white p-3 rounded border border-default-100 shadow-sm relative pr-10">
                    <div className="col-span-12 sm:col-span-6">
                      <label className="text-xs text-gray-500 mb-1 block">团购类型</label>
                      <select className="form-input w-full border rounded px-2 text-sm" {...register(`group_scheme.${index}.name`)}>
                        <option value="线上团购">线上团购</option>
                        <option value="线下团购">线下团购</option>
                      </select>
                    </div>
                    <div className="col-span-12 sm:col-span-6">
                      <label className="text-xs text-gray-500 mb-1 block">折扣值</label>
                      <div className="flex">
                        <input type="number" step="0.01" className="form-input w-full border border-r-0 rounded-l py-1 px-2 text-sm focus:z-10" {...register(`group_scheme.${index}.value`, { valueAsNumber: true })} />
                        <select className="form-select border rounded-r px-2 text-sm bg-gray-50 focus:z-10 w-20 shrink-0" {...register(`group_scheme.${index}.suffix`)}>
                          <option value="%">%</option>
                          <option value="元">元</option>
                        </select>
                      </div>
                    </div>
                    <button type="button" onClick={() => removeGroup(index)} className="absolute top-1/2 -translate-y-1/2 right-3 text-danger hover:bg-danger/10 p-1 rounded">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* 绩效方案 */}
              <div className="border border-default-200 rounded-lg p-4 bg-gray-50/50">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-gray-800">绩效方案</label>
                  <button type="button" onClick={() => appendPerformance({ type: "新生成交", role_name: "教师", value: 0, suffix: "元" })} className="btn btn-sm bg-primary/10 text-primary hover:bg-primary/20 flex items-center gap-1 text-xs py-1 px-2 rounded">
                    <Plus className="size-3" /> 新增绩效方案
                  </button>
                </div>
                {performanceFields.map((item, index) => (
                  <div key={item.id} className="grid grid-cols-12 gap-3 my-3 bg-white p-3 rounded border border-default-100 shadow-sm relative pr-10">
                    <div className="col-span-12 sm:col-span-4">
                      <label className="text-xs text-gray-500 mb-1 block">绩效类型</label>
                      <select className="form-input w-full border rounded py-1 px-2 text-sm" {...register(`performance_scheme.${index}.type`)}>
                        <option value="新生成交">新生成交</option>
                        <option value="老生续费">老生续费</option>
                        <option value="课时消耗">课时消耗</option>
                        <option value="退费扣除">退费扣除</option>
                      </select>
                    </div>
                    <div className="col-span-12 sm:col-span-4">
                      <label className="text-xs text-gray-500 mb-1 block">适用角色</label>
                      <select className="form-input w-full border rounded py-1 px-2 text-sm" {...register(`performance_scheme.${index}.role_name`)}>
                        <option value="教师">教师</option>
                        <option value="课程顾问">课程顾问</option>
                      </select>
                    </div>
                    <div className="col-span-12 sm:col-span-4">
                      <label className="text-xs text-gray-500 mb-1 block">绩效值</label>
                      <div className="flex">
                        <input type="number" step="0.01" placeholder="值" className="form-input w-full border border-r-0 rounded-l py-1 px-2 text-sm focus:z-10" {...register(`performance_scheme.${index}.value`, { valueAsNumber: true })} />
                        <select className="form-select border rounded-r px-2 text-sm bg-gray-50 focus:z-10 w-20 shrink-0" {...register(`performance_scheme.${index}.suffix`)}>
                          <option value="元">元</option>
                          <option value="%">%</option>
                        </select>
                      </div>
                    </div>
                    <button type="button" onClick={() => removePerformance(index)} className="absolute top-1/2 -translate-y-1/2 right-3 text-danger hover:bg-danger/10 p-1 rounded">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* 退费方案 */}
              <div className="border border-default-200 rounded-lg p-4 bg-gray-50/50">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-gray-800">退费方案</label>
                  <button type="button" onClick={() => appendRefund({ name: "", reference_code: "", value: 0, suffix: "%" })} className="btn btn-sm bg-primary/10 text-primary hover:bg-primary/20 flex items-center gap-1 text-xs py-1 px-2 rounded">
                    <Plus className="size-3" /> 新增退费方案
                  </button>
                </div>
                {refundFields.map((item, index) => (
                  <div key={item.id} className="grid grid-cols-12 gap-3 my-3 bg-white p-3 rounded border border-default-100 shadow-sm relative pr-10">
                    <div className="col-span-12 sm:col-span-4">
                      <label className="text-xs text-gray-500 mb-1 block">方案名称</label>
                      <input type="text" placeholder="如: 转账手续费" className="form-input w-full border rounded py-1 px-2 text-sm" {...register(`refund_scheme.${index}.name`)} />
                    </div>
                    <div className="col-span-12 sm:col-span-4">
                      <label className="text-xs text-gray-500 mb-1 block">扣费基数</label>
                      <select className="form-input w-full border rounded px-2 text-sm" {...register(`refund_scheme.${index}.reference_code`)}>
                        <option value="">空</option>
                        {refundRefs.map(ref => (
                          <option key={ref.code} value={ref.code}>{ref.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-12 sm:col-span-4">
                      <label className="text-xs text-gray-500 mb-1 block">扣费值</label>
                      <div className="flex">
                        <input type="number" step="0.01" className="form-input w-full border border-r-0 rounded-l py-1 px-2 text-sm focus:z-10" {...register(`refund_scheme.${index}.value`, { valueAsNumber: true })} />
                        <select className="form-select border rounded-r px-2 text-sm bg-gray-50 focus:z-10 w-20 shrink-0" {...register(`refund_scheme.${index}.suffix`)}>
                          <option value="%">%</option>
                          <option value="元">元</option>
                        </select>
                      </div>
                    </div>
                    <button type="button" onClick={() => removeRefund(index)} className="absolute top-1/2 -translate-y-1/2 right-3 text-danger hover:bg-danger/10 p-1 rounded">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                ))}
              </div>

            </div>

            <div className="card-footer flex justify-end items-center gap-x-2 py-3 px-4 shrink-0">
              <button type="button" className="btn bg-transparent text-danger hover:bg-danger/10" data-hs-overlay="#course-edit-modal">
                取消
              </button>
              <button type="submit" className="btn bg-primary text-white hover:bg-primary-600">
                保存修改
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCourse;