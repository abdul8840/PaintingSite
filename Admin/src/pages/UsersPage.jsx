import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, updateUser } from '../store/slices/userSlice';
import DataTable from '../components/common/DataTable';
import Pagination from '../components/common/Pagination';
import SearchInput from '../components/common/SearchInput';
import StatusBadge from '../components/common/StatusBadge';
import Modal from '../components/common/Modal';
import { useToast } from '../hooks/useToast';
import { HiUsers, HiPencil, HiFilter, HiUserCircle } from 'react-icons/hi';

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

  const roleFilters = [
    { value: '', label: 'All Users' },
    { value: 'customer', label: 'Customers' },
    { value: 'artist', label: 'Artists' },
    { value: 'admin', label: 'Admins' },
  ];

  const columns = [
    {
      header: 'User',
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.avatar?.url ? (
            <img 
              src={row.avatar.url} 
              alt={row.firstName}
              className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center border-2 border-gray-200">
              <span className="text-lg font-bold text-gray-700">{row.firstName?.[0]}</span>
            </div>
          )}
          <div>
            <p className="font-semibold text-gray-900">{row.firstName} {row.lastName}</p>
            <p className="text-xs text-gray-500">{row.email}</p>
          </div>
        </div>
      ),
    },
    { 
      header: 'Phone', 
      render: (row) => (
        <span className="text-sm text-gray-600">{row.phone || '-'}</span>
      )
    },
    { 
      header: 'Role', 
      render: (row) => <StatusBadge status={row.role} /> 
    },
    { 
      header: 'Status', 
      render: (row) => <StatusBadge status={row.isActive ? 'active' : 'inactive'} /> 
    },
    { 
      header: 'Joined', 
      render: (row) => (
        <span className="text-sm text-gray-600">{new Date(row.createdAt).toLocaleDateString()}</span>
      )
    },
    {
      header: 'Actions',
      render: (row) => (
        <button 
          onClick={() => handleEdit(row)}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-900 hover:text-white transition-all duration-200 cursor-pointer text-sm font-medium"
        >
          <HiPencil className="w-4 h-4" />
          <span>Edit</span>
        </button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center shadow-lg">
                <HiUsers className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              Users
            </h1>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              Manage user accounts and permissions • {pagination?.total || 0} total users
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6">
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Users</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{pagination?.total || 0}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Customers</p>
              <p className="text-xl sm:text-2xl font-bold text-blue-600">
                {items?.filter(item => item.role === 'customer').length || 0}
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Artists</p>
              <p className="text-xl sm:text-2xl font-bold text-purple-600">
                {items?.filter(item => item.role === 'artist').length || 0}
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Active</p>
              <p className="text-xl sm:text-2xl font-bold text-green-600">
                {items?.filter(item => item.isActive).length || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <SearchInput 
                value={search} 
                onChange={(v) => { setSearch(v); setPage(1); }} 
                placeholder="Search by name or email..." 
              />
            </div>
            
            <div className="lg:w-64">
              <div className="flex items-center gap-2 mb-2">
                <HiFilter className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-semibold text-gray-900">Filter by Role</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {roleFilters.map((filter) => (
                  <button 
                    key={filter.value}
                    onClick={() => { setRole(filter.value); setPage(1); }}
                    className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                      role === filter.value
                        ? 'bg-gray-900 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-gray-800 via-gray-900 to-black"></div>
          
          <div className="overflow-x-auto">
            <DataTable 
              columns={columns} 
              data={items} 
              loading={loading} 
              emptyMessage="No users found" 
            />
          </div>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="border-t border-gray-200 p-4 sm:p-6 bg-gray-50">
              <Pagination pagination={pagination} onPageChange={setPage} />
            </div>
          )}
        </div>
      </div>

      {/* Edit User Modal */}
      <Modal 
        isOpen={!!editingUser} 
        onClose={() => setEditingUser(null)} 
        title={
          <div className="flex items-center gap-3">
            <HiUserCircle className="w-6 h-6 text-gray-700" />
            <span>Edit User - {editingUser?.firstName} {editingUser?.lastName}</span>
          </div>
        }
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Role
            </label>
            <select 
              value={editForm.role} 
              onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 cursor-pointer"
            >
              <option value="customer">Customer</option>
              <option value="artist">Artist</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <input 
              type="checkbox" 
              id="isActive"
              checked={editForm.isActive} 
              onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })}
              className="w-5 h-5 text-gray-900 border-gray-300 rounded focus:ring-2 focus:ring-gray-900 cursor-pointer"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-900 cursor-pointer">
              Active User
            </label>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button 
              onClick={() => setEditingUser(null)}
              className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-gray-900 hover:text-gray-900 transition-all duration-200 cursor-pointer"
            >
              Cancel
            </button>
            <button 
              onClick={handleUpdate}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}