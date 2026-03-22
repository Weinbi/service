import { useEffect, useState } from 'react';
import axios from '@/utils/request';
import PageMeta from '@/components/PageMeta';
import UserList from './components/UserList';
import AddUser from './components/AddUser';
import EditUser from './components/EditUser';
import DeleteModal from './components/DeleteModal';

const Index = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <PageMeta title="用户管理" />
      <main>
        <UserList users={users} onSelectUser={setSelectedUser} />
      </main>

      <AddUser onAddSuccess={fetchUsers} />
      <EditUser user={selectedUser} onUpdateSuccess={fetchUsers} />
      <DeleteModal user={selectedUser} onDeleteSuccess={fetchUsers} />
    </>
  );
};

export default Index;