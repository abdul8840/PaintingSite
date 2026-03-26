import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchCustomOrders } from '../store/slices/customOrderSlice';
import DataTable from '../components/common/DataTable';
import Pagination from '../components/common/Pagination';
import StatusBadge from '../components/common/StatusBadge';
import { HiEye } from 'react-icons/hi';

export default function CustomOrdersPage() {
  const dispatch = useDispatch();
  const { items, pagination, loading } = useSelector((state) => state.customOrders);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const params = `page=${page}&limit=20${status ? `&status=${status}` : ''}`;
    dispatch(fetchCustomOrders(params));
  }, [dispatch, page, status]);

  const columns = [
    { header: 'Order #', render: (row) => <Link to={`/custom-orders/${row._id}`}>{row.orderNumber}</Link> },
    { header: 'Customer', render: (row) => <span>{row.user?.firstName} {row.user?.lastName}</span> },
    { header: 'Style', render: (row) => <span>{row.sketchStyle}</span> },
    { header: 'Size', render: (row) => <span>{row.canvasSize}</span> },
    { header: 'Artist', render: (row) => <span>{row.assignedArtist ? `${row.assignedArtist.firstName} ${row.assignedArtist.lastName}` : 'Unassigned'}</span> },
    { header: 'Total', render: (row) => <span>${row.totalAmount?.toFixed(2)}</span> },
    { header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    { header: 'Date', render: (row) => <span>{new Date(row.createdAt).toLocaleDateString()}</span> },
    { header: 'Actions', render: (row) => <Link to={`/custom-orders/${row._id}`}><HiEye /> View</Link> },
  ];

  return (
    <div>
      <h1>Custom Orders</h1>

      <div>
        {['', 'pending', 'accepted', 'in-progress', 'review', 'completed', 'shipped', 'delivered', 'cancelled'].map((s) => (
          <button key={s} onClick={() => { setStatus(s); setPage(1); }} data-active={status === s}>{s || 'All'}</button>
        ))}
      </div>

      <DataTable columns={columns} data={items} loading={loading} emptyMessage="No custom orders found" />
      <Pagination pagination={pagination} onPageChange={setPage} />
    </div>
  );
}