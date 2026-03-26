import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCoupons, createCoupon, updateCoupon, deleteCoupon } from '../store/slices/couponSlice';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import CouponForm from '../components/coupon/CouponForm';
import StatusBadge from '../components/common/StatusBadge';
import { useToast } from '../hooks/useToast';
import { HiPlus, HiPencil, HiTrash } from 'react-icons/hi';

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
    { header: 'Code', render: (row) => <span>{row.code}</span> },
    { header: 'Type', render: (row) => <span>{row.discountType === 'percentage' ? `${row.discountValue}%` : `$${row.discountValue}`}</span> },
    { header: 'Min Order', render: (row) => <span>${row.minimumOrderAmount}</span> },
    { header: 'Used', render: (row) => <span>{row.usedCount}{row.usageLimit ? `/${row.usageLimit}` : ''}</span> },
    { header: 'Applies To', render: (row) => <span>{row.applicableTo}</span> },
    { header: 'Expires', render: (row) => <span>{new Date(row.endDate).toLocaleDateString()}</span> },
    { header: 'Status', render: (row) => <StatusBadge status={row.isActive ? 'active' : 'inactive'} /> },
    {
      header: 'Actions',
      render: (row) => (
        <div>
          <button onClick={() => setEditing(row)}><HiPencil /></button>
          <button onClick={() => setDeleteId(row._id)}><HiTrash /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div>
        <h1>Coupons</h1>
        <button onClick={() => setShowForm(true)}><HiPlus /> Create Coupon</button>
      </div>

      <DataTable columns={columns} data={items} loading={loading} emptyMessage="No coupons found" />

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Create Coupon" size="large">
        <CouponForm onSubmit={handleCreate} loading={formLoading} onCancel={() => setShowForm(false)} />
      </Modal>

      <Modal isOpen={!!editing} onClose={() => setEditing(null)} title="Edit Coupon" size="large">
        <CouponForm initialData={editing} onSubmit={handleUpdate} loading={formLoading} onCancel={() => setEditing(null)} />
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Coupon" message="Are you sure you want to delete this coupon?" confirmText="Delete" />
    </div>
  );
}