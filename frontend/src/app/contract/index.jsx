import { useEffect, useState } from 'react';
import axios from '@/utils/request';
import PageMeta from '@/components/PageMeta';
import ContractList from './components/ContractList';
import AddContract from './components/AddContract';
import DeleteModal from './components/DeleteModal';
import ContractDetail from './components/ContractDetail';
import PaymentConfirm from './components/PaymentConfirm';

const Index = () => {
  const [contracts, setContracts] = useState([]);
  const [selectedContract, setSelectedContract] = useState(null);

  const fetchContracts = async () => {
    try {
      const response = await axios.get('/api/contracts');
      setContracts(response.data);
    } catch (error) {
      console.error("Failed to fetch contracts", error);
    }
  }

  useEffect(() => {
    fetchContracts();
  }, []);

  return (
    <>
      <PageMeta title="报名合同" />
      <main>
        <ContractList contracts={contracts} onSelectContract={setSelectedContract} />
      </main>

      <AddContract onAddSuccess={fetchContracts} />
      <DeleteModal contract={selectedContract} onDeleteSuccess={fetchContracts} />
      <ContractDetail contract={selectedContract} />
      <PaymentConfirm contract={selectedContract} onSuccess={fetchContracts} />
    </>
  );
};

export default Index;