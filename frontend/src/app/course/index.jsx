import { useState, useEffect } from 'react';
import axios from '@/utils/request';
import PageMeta from '@/components/PageMeta';
import CourseList from './components/CourseList';
import AddCourse from './components/AddCourse';
import EditCourse from './components/EditCourse';
import DeleteModal from './components/DeleteModal';

const Index = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('/api/courses');
      setCourses(response.data);
    } catch (error) {
      console.error("Failed to fetch courses", error);
    }
  }

  useEffect(() => {
    fetchCourses();
  }, []);

  return <>
    <PageMeta title="课程管理" />
    <main>
      <CourseList courses={courses} onSelectCourse={setSelectedCourse} />
    </main>

    <AddCourse onAddSuccess={fetchCourses} />
    <EditCourse course={selectedCourse} onUpdateSuccess={fetchCourses} />
    <DeleteModal course={selectedCourse} onDeleteSuccess={fetchCourses} />
  </>;
};

export default Index;