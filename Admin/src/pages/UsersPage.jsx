import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, updateUser } from '../store/slices/userSlice';
import DataTable from '../components/common/DataTable';
import Pagination from '../components/common/Pagination';
import SearchInput from '../components/common/SearchInput';
import StatusBadge from '../components/common/StatusBadge';
import Modal from '../components/common/Modal';
import { useToast } from '../hooks/useToast';

export default function UsersPage() {
  const dispatch = useDispatch();
  const toast = useToast();
  const { items, pagination, loading } = useSelector((state) => state.users);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ role: '', isActive: true });

  useEffect(() => {
    const params = `page=${page}&limit=20${search ? `&search=${search}` : ''}${role ? `&role=${role}` : ''}`;
    dispatch(fetchUsers(params));
  }, [dispatch, page, search, role]);

  const handleEdit = (user) => {
    setEditingUser(user);
    setEditForm({ role: user.role, isActive: user.isActive });
  };

  const handleUpdate = async () => {
    try {
      await dispatch(updateUser({ id: editingUser._id, data: editForm })).unwrap();
      toast.success('User updated!');
      setEditingUser(null);
    } catch (err) {
      toast.error(err);
    }
  };

  const columns = [
    {
      header: 'User',
      render: (row) => (
        <div>
          {row.avatar?.url ? <img src={row.avatar.url} alt="" style={{ width: 32, height: 32, borderRadius: '50%' }} /> : <div>{row.firstName?.[0]}</div>}
          <div><p>{row.firstName} {row.lastName}</p><p>{row.email}</p></div>
        </div>
      ),
    },
    { header: 'Phone', render: (row) => <span>{row.phone || '-'}</span> },
    { header: 'Role', render: (row) => <StatusBadge status={row.role} /> },
    { header: 'Status', render: (row) => <StatusBadge status={row.isActive ? 'active' : 'inactive'} /> },
    { header: 'Joined', render: (row) => <span>{new Date(row.createdAt).toLocaleDateString()}</span> },
    {
      header: 'Actions',
      render: (row) => <button onClick={() => handleEdit(row)}>Edit</button>,
    },
  ];

  return (
    <div>
      <h1>Users</h1>

      <div>
        <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search users..." />
        <div>
          {['', 'customer', 'artist', 'admin'].map((r) => (
            <button key={r} onClick={() => { setRole(r); setPage(1); }} data-active={role === r}>{r || 'All'}</button>
          ))}
        </div>
      </div>

      <DataTable columns={columns} data={items} loading={loading} emptyMessage="No users found" />
      <Pagination pagination={pagination} onPageChange={setPage} />

      <Modal isOpen={!!editingUser} onClose={() => setEditingUser(null)} title={`Edit User - ${editingUser?.firstName} ${editingUser?.lastName}`}>
        <div>
          <div>
            <label>Role</label>
            <select value={editForm.role} onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}>
              <option value="customer">Customer</option>
              <option value="artist">Artist</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label>
              <input type="checkbox" checked={editForm.isActive} onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })} />
              Active
            </label>
          </div>
          <div>
            <button onClick={() => setEditingUser(null)}>Cancel</button>
            <button onClick={handleUpdate}>Save</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}