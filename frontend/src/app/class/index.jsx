import { useEffect, useState } from 'react';
import axios from '@/utils/request';
import PageMeta from '@/components/PageMeta';
import ClassList from './components/ClassList';
import AddClass from './components/AddClass';
import EditClass from './components/EditClass';
import DeleteModal from './components/DeleteModal';

const Index = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);

  const fetchClasses = async () => {
    try {
      const response = await axios.get('/api/classes');
      setClasses(response.data);
    } catch (error) {
      console.error("Failed to fetch classes", error);
    }
  }

  useEffect(() => {
    fetchClasses();
  }, []);

  return (
    <>
      <PageMeta title="班级管理" />
      <main>
        <ClassList classes={classes} onSelectClass={setSelectedClass} />
      </main>

      <AddClass onAddSuccess={fetchClasses} />
      <EditClass classItem={selectedClass} onUpdateSuccess={fetchClasses} />
      <DeleteModal classItem={selectedClass} onDeleteSuccess={fetchClasses} />
    </>
  );
};

export default Index;