import { useEffect, useState } from 'react';
import axios from '@/utils/request';
import PageMeta from '@/components/PageMeta';
import StudentList from './components/StudentList';
import AddStudent from './components/AddStudent';
import EditStudent from './components/EditStudent';
import DeleteModal from './components/DeleteModal';
import StudentDetail from './components/StudentDetail'; // 新增
import AddRecord from './components/AddRecord'; // 新增

const Index = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [recordRefresh, setRecordRefresh] = useState(0); // 记录刷新的触发器

  const fetchStudents = async () => {
    try {
      const response = await axios.get('/api/students');
      setStudents(response.data);
    } catch (error) {
      console.error("Failed to fetch students", error);
    }
  }

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleAddRecordSuccess = () => {
    setRecordRefresh(prev => prev + 1); // 触发 StudentDetails 内部重新请求数据
  };

  return (
    <>
      <PageMeta title="学生管理" />
      <main>
        <StudentList students={students} onSelectStudent={setSelectedStudent} />
      </main>

      <AddStudent onAddSuccess={fetchStudents} />
      <EditStudent student={selectedStudent} onUpdateSuccess={fetchStudents} />
      <DeleteModal student={selectedStudent} onDeleteSuccess={fetchStudents} />
      
      {/* 详情及添加跟进动态弹窗 */}
      <StudentDetail student={selectedStudent} refreshTrigger={recordRefresh} />
      <AddRecord student={selectedStudent} onAddSuccess={handleAddRecordSuccess} />
    </>
  );
};

export default Index;