// frontend/src/app/role/components/AddRole.jsx
import { useRef } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { X, Plus, Trash } from 'lucide-react';
import axios from '@/utils/request';
import { showAlert } from '@/components/Alert';

const AddRole = ({ onSuccess, permissionsMap, salarySchemesList, taxSchemesList }) => {
  const closeBtnRef = useRef(null);
  const { register, control, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    defaultValues: {
      role_name: '',
      role_description: '',
      permissions: [],
      salary_scheme: [],
      tax_scheme: []
    }
  });

  const { fields: salaryFields, append: appendSalary, remove: removeSalary } = useFieldArray({ control, name: "salary_scheme" });
  const { fields: taxFields, append: appendTax, remove: removeTax } = useFieldArray({ control, name: "tax_scheme" });

  const onSubmit = async (data) => {
    try {
      await axios.post('/api/roles', data);
      showAlert('角色添加成功', 'success');
      reset();
      onSuccess();
      closeBtnRef.current?.click();
    } catch (error) {
      showAlert('添加失败: ' + (error.response?.data?.message || error.message), 'danger');
    }
  };

  const handleSchemeSelect = (index, selectedName, schemeType, sourceList) => {
    const matched = sourceList.find(s => s.name === selectedName);
    if (matched) {
      setValue(`${schemeType}.${index}.type`, matched.type);
      setValue(`${schemeType}.${index}.reference_code`, matched.reference_code || 'null');
      setValue(`${schemeType}.${index}.value`, matched.value);
      setValue(`${schemeType}.${index}.suffix`, matched.suffix);
    }
  };

  return (
    <div id="role-add-modal" className="hs-overlay hidden size-full fixed top-0 start-0 z-80 overflow-x-hidden overflow-y-auto pointer-events-none">
      <div className="hs-overlay-animation-target hs-overlay-open:scale-100 hs-overlay-open:opacity-100 scale-95 opacity-0 ease-in-out transition-all duration-200 sm:max-w-2xl sm:w-full m-3 sm:mx-auto min-h-[calc(100%-56px)] flex items-center">
        <div className="w-full flex flex-col bg-white border border-default-200 shadow-sm rounded-xl pointer-events-auto">
          <div className="flex justify-between items-center py-3 px-4 border-b border-default-200">
            <h3 className="font-bold text-default-800">添加新角色</h3>
            <button ref={closeBtnRef} type="button" className="size-8 flex justify-center items-center text-default-500 rounded-full hover:bg-default-100" data-hs-overlay="#role-add-modal">
              <X className="size-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-4 overflow-y-auto">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">角色名称 <span className="text-danger">*</span></label>
                <input type="text" className="form-input" {...register('role_name', { required: true })} placeholder="如：课程顾问" />
                {errors.role_name && <p className="text-xs text-danger mt-1">角色名称为必填项</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">角色描述</label>
                <input type="text" className="form-input" {...register('role_description')} placeholder="简单描述该角色的职责" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">权限分配</label>
                <div className="grid grid-cols-2 gap-2">
                  {permissionsMap.map(perm => (
                    <label key={perm.code} className="flex items-center gap-2 text-sm text-default-700">
                      <input type="checkbox" value={perm.code} {...register('permissions')} className="form-checkbox rounded border-default-300 focus:ring-primary" />
                      {perm.name} <span className="text-default-400 text-xs">({perm.desc})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 薪酬方案 */}
              <div className="border border-default-200 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium">薪酬方案</label>
                  <button type="button" onClick={() => appendSalary({ type: '', name: '', reference_code: 'null', value: 0, suffix: '元' })} className="btn btn-xs bg-primary/10 text-primary">
                    <Plus className="size-3 mr-1" /> 添加项
                  </button>
                </div>
                {salaryFields.map((field, index) => {
                  const suffix = watch(`salary_scheme.${index}.suffix`) || '元';
                  return (
                    <div key={field.id} className="flex gap-2 mb-2 items-center bg-default-50 p-2 rounded">
                      <select className="form-input text-sm w-1/2" {...register(`salary_scheme.${index}.name`)} onChange={(e) => handleSchemeSelect(index, e.target.value, 'salary_scheme', salarySchemesList)}>
                        <option value="">选择项目</option>
                        {salarySchemesList.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                      </select>
                      <div className="flex w-1/2">
                        <input type="number" className="form-input text-sm rounded-r-none" {...register(`salary_scheme.${index}.value`)} placeholder="数值" />
                        <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-default-200 bg-default-100 text-default-500 text-sm">{suffix}</span>
                      </div>
                      <button type="button" onClick={() => removeSalary(index)} className="text-danger p-1"><Trash className="size-4" /></button>
                    </div>
                  );
                })}
              </div>

              {/* 税务方案 */}
              <div className="border border-default-200 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium">税务与社保方案</label>
                  <button type="button" onClick={() => appendTax({ type: '', name: '', reference_code: 'gross_salary', value: 0, suffix: '%' })} className="btn btn-xs bg-primary/10 text-primary">
                    <Plus className="size-3 mr-1" /> 添加项
                  </button>
                </div>
                {taxFields.map((field, index) => {
                  const suffix = watch(`tax_scheme.${index}.suffix`) || '%';
                  return (
                    <div key={field.id} className="flex gap-2 mb-2 items-center bg-default-50 p-2 rounded">
                      <select className="form-input text-sm w-1/2" {...register(`tax_scheme.${index}.name`)} onChange={(e) => handleSchemeSelect(index, e.target.value, 'tax_scheme', taxSchemesList)}>
                        <option value="">选择项目</option>
                        {taxSchemesList.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                      </select>
                      <div className="flex w-1/2">
                        <input type="number" step="0.01" className="form-input text-sm rounded-r-none" {...register(`tax_scheme.${index}.value`)} placeholder="数值" />
                        <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-default-200 bg-default-100 text-default-500 text-sm">{suffix}</span>
                      </div>
                      <button type="button" onClick={() => removeTax(index)} className="text-danger p-1"><Trash className="size-4" /></button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button type="button" className="btn btn-soft-secondary" data-hs-overlay="#role-add-modal">取消</button>
              <button type="submit" className="btn bg-primary text-white">确认添加</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddRole;