import { useEffect, useState } from 'react';
import axios from '@/utils/request';
import PageMeta from '@/components/PageMeta';
import TextbookList from './components/TextbookList';
import AddTextbook from './components/AddTextbook';
import EditTextbook from './components/EditTextbook';
import DeleteModal from './components/DeleteModal';
import TextbookDetail from './components/TextbookDetail';

const Index = () => {
  const [textbooks, setTextbooks] = useState([]);
  const [selectedTextbook, setSelectedTextbook] = useState(null);

  const fetchTextbooks = async () => {
    try {
      const response = await axios.get('/api/textbooks');
      setTextbooks(response.data);
    } catch (error) {
      console.error("Failed to fetch textbooks", error);
    }
  }

  useEffect(() => {
    fetchTextbooks();
  }, []);

  return (
    <>
      <PageMeta title="教材管理" />
      <main>
        <TextbookList textbooks={textbooks} onSelectTextbook={setSelectedTextbook} />
      </main>

      <AddTextbook onAddSuccess={fetchTextbooks} />
      <EditTextbook textbook={selectedTextbook} onUpdateSuccess={fetchTextbooks} />
      <DeleteModal textbook={selectedTextbook} onDeleteSuccess={fetchTextbooks} />
      <TextbookDetail textbook={selectedTextbook} />
    </>
  );
};

export default Index;