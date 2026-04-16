import { useEffect, useState } from 'react';
import axios from '@/utils/request';
import PageMeta from '@/components/PageMeta';
import FinancialRecordList from './components/FinancialRecordList';
import AddFinancialRecord from './components/AddFinancialRecord';
import FinancialRecordDetail from './components/FinancialRecordDetail';

const Index = () => {
  const [financialRecords, setFinancialRecords] = useState([]);
  const [selectedFinancialRecord, setSelectedFinancialRecord] = useState(null);

  const fetchFinancialRecords = async () => {
    try {
      const response = await axios.get('/api/financialRecords');
      setFinancialRecords(response.data);
    } catch (error) {
      console.error("Failed to fetch financialRecords", error);
    }
  }

  useEffect(() => {
    fetchFinancialRecords();
  }, []);

  return (
    <>
      <PageMeta title="财务流水" />
      <main>
        <FinancialRecordList records={financialRecords} onSelectFinancialRecord={setSelectedFinancialRecord} />
      </main>

      <AddFinancialRecord onAddSuccess={fetchFinancialRecords} />
      <FinancialRecordDetail financialRecord={selectedFinancialRecord} refreshTrigger={fetchFinancialRecords} />
    </>
  );
};

export default Index;