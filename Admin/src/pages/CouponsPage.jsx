import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCoupons, createCoupon, updateCoupon, deleteCoupon } from '../store/slices/couponSlice';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import CouponForm from '../components/coupon/CouponForm';
import StatusBadge from '../components/common/StatusBadge';
import { useToast } from '../hooks/useToast';
import { HiPlus, HiPencil, HiTrash, HiTicket, HiClock, HiUsers } from 'react-icons/hi';

export default function CouponsPage() {
  const dispatch = useDispatch();
  const toast = useToast();
  const { items, loading, formLoading } = useSelector((state) => state.coupons);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => { dispatch(fetchCoupons()); }, [dispatch]);

  const handleCreate = async (data) => {
    try {
      await dispatch(createCoupon(data)).unwrap();
      toast.success('Coupon created!');
      setShowForm(false);
    } catch (err) { toast.error(err); }
  };

  const handleUpdate = async (data) => {
    try {
      await dispatch(updateCoupon({ id: editing._id, data })).unwrap();
      toast.success('Coupon updated!');
      setEditing(null);
    } catch (err) { toast.error(err); }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteCoupon(deleteId)).unwrap();
      toast.success('Coupon deleted');
    } catch (err) { toast.error(err); }
    setDeleteId(null);
  };

  const columns = [
    { 
      header: 'Code', 
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            <HiTicket className="w-5 h-5 text-white" />
          </div>
          <span className="font-mono font-bold text-gray-900 text-sm sm:text-base">{row.code}</span>
        </div>
      )
    },
    { 
      header: 'Discount', 
      render: (row) => (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-green-100 text-green-800">
          {row.discountType === 'percentage' ? `${row.discountValue}%` : `$${row.discountValue}`}
        </span>
      )
    },
    { 
      header: 'Min Order', 
      render: (row) => (
        <span className="text-sm text-gray-700 font-medium">${row.minimumOrderAmount}</span>
      )
    },
    { 
      header: 'Usage', 
      render: (row) => (
        <div className="flex items-center gap-2">
          <HiUsers className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-semibold text-gray-900">
            {row.usedCount}{row.usageLimit ? `/${row.usageLimit}` : ''}
          </span>
        </div>
      )
    },
    { 
      header: 'Applies To', 
      render: (row) => (
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
          {row.applicableTo}
        </span>
      )
    },
    { 
      header: 'Expires', 
      render: (row) => (
        <div className="flex items-center gap-2">
          <HiClock className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-700">{new Date(row.endDate).toLocaleDateString()}</span>
        </div>
      )
    },
    { 
      header: 'Status', 
      render: (row) => <StatusBadge status={row.isActive ? 'active' : 'inactive'} /> 
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setEditing(row)}
            className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-900 hover:text-white transition-all duration-200 cursor-pointer"
            title="Edit"
          >
            <HiPencil className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setDeleteId(row._id)}
            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-200 cursor-pointer"
            title="Delete"
          >
            <HiTrash className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center shadow-lg">
                  <HiTicket className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                Coupons
              </h1>
              <p className="mt-2 text-sm sm:text-base text-gray-600">
                Manage discount coupons and promotional codes • {items?.length || 0} total coupons
              </p>
            </div>

            <button 
              onClick={() => setShowForm(true)}
              className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 cursor-pointer"
            >
              <HiPlus className="w-5 h-5" />
              <span className="text-sm sm:text-base">Create Coupon</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6">
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Coupons</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{items?.length || 0}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Active</p>
              <p className="text-xl sm:text-2xl font-bold text-green-600">
                {items?.filter(item => item.isActive).length || 0}
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Usage</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {items?.reduce((sum, item) => sum + (item.usedCount || 0), 0)}
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Expiring Soon</p>
              <p className="text-xl sm:text-2xl font-bold text-red-600">
                {items?.filter(item => {
                  const daysUntilExpiry = (new Date(item.endDate) - new Date()) / (1000 * 60 * 60 * 24);
                  return daysUntilExpiry > 0 && daysUntilExpiry <= 7;
                }).length || 0}
              </p>
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
              emptyMessage="No coupons found. Create your first coupon to get started!" 
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Create Coupon" size="large">
        <CouponForm onSubmit={handleCreate} loading={formLoading} onCancel={() => setShowForm(false)} />
      </Modal>

      <Modal isOpen={!!editing} onClose={() => setEditing(null)} title="Edit Coupon" size="large">
        <CouponForm initialData={editing} onSubmit={handleUpdate} loading={formLoading} onCancel={() => setEditing(null)} />
      </Modal>

      <ConfirmDialog 
        isOpen={!!deleteId} 
        onClose={() => setDeleteId(null)} 
        onConfirm={handleDelete} 
        title="Delete Coupon" 
        message="Are you sure you want to delete this coupon?" 
        confirmText="Delete" 
      />
    </div>
  );
}