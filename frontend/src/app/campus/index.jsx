import { useState } from 'react';
import PageMeta from '@/components/PageMeta';
import CampusList from './components/CampusList';
import AddCampus from './components/AddCampus';
import EditCampus from './components/EditCampus';
import DeleteModal from './components/DeleteModal';

const Index = () => {
  const [refreshKey, setRefreshKey] = useState(0); // 用于触发列表刷新
  const [selectedCampus, setSelectedCampus] = useState(null); // 当前选中的校区（用于编辑或删除）

  const handleRefresh = () => {
    setRefreshKey(old => old + 1);
  };

  return <>
    <PageMeta title="校区管理" />
    <main>
      <CampusList
        refreshKey={refreshKey}
        onEdit={(campus) => setSelectedCampus(campus)}
        onDelete={(campus) => setSelectedCampus(campus)}
      />

      <AddCampus onSuccess={handleRefresh} />

      <EditCampus campusData={selectedCampus} onSuccess={handleRefresh} />

      <DeleteModal campusData={selectedCampus} onSuccess={handleRefresh} />
    </main>
  </>;
};
export default Index;