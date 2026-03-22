import { useState, useEffect } from 'react';
import axios from '@/utils/request';
import PageMeta from '@/components/PageMeta';
import RoleList from './components/RoleList';
import AddRole from './components/AddRole';
import EditRole from './components/EditRole';
import DeleteModal from './components/DeleteModal';

const Index = () => {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);

  // 配置字典
  const [permissionsMap, setPermissionsMap] = useState([]);
  const [salarySchemesList, setSalarySchemesList] = useState([]);
  const [taxSchemesList, setTaxSchemesList] = useState([]);

  const fetchData = async () => {
    try {
      const [rolesRes, permRes, salaryRes, taxRes] = await Promise.all([
        axios.get('/api/roles'),
        axios.get('/api/roles/permissions'),
        axios.get('/api/roles/salary-schemes'),
        axios.get('/api/roles/tax-schemes')
      ]);
      setRoles(rolesRes.data);
      setPermissionsMap(permRes.data);
      setSalarySchemesList(salaryRes.data);
      setTaxSchemesList(taxRes.data);
    } catch (error) {
      console.error("加载数据失败", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <PageMeta title="角色列表" />
      <main>
        <RoleList roles={roles} onSelectRole={setSelectedRole} />
      </main>

      <AddRole onSuccess={fetchData} permissionsMap={permissionsMap} salarySchemesList={salarySchemesList} taxSchemesList={taxSchemesList} />

      <EditRole role={selectedRole} onSuccess={fetchData} permissionsMap={permissionsMap} salarySchemesList={salarySchemesList} taxSchemesList={taxSchemesList} />

      <DeleteModal role={selectedRole} onDeleteSuccess={fetchData} />
    </>
  );
};
export default Index;