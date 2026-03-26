import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchOrders } from '../store/slices/orderSlice';
import DataTable from '../components/common/DataTable';
import Pagination from '../components/common/Pagination';
import StatusBadge from '../components/common/StatusBadge';
import SearchInput from '../components/common/SearchInput';
import { HiEye } from 'react-icons/hi';

export default function OrdersPage() {
  const dispatch = useDispatch();
  const { items, pagination, loading } = useSelector((state) => state.orders);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const params = `page=${page}&limit=20${status ? `&status=${status}` : ''}`;
    dispatch(fetchOrders(params));
  }, [dispatch, page, status]);

  const columns = [
    { header: 'Order #', render: (row) => <Link to={`/orders/${row._id}`}>{row.orderNumber}</Link> },
    { header: 'Customer', render: (row) => <span>{row.user?.firstName} {row.user?.lastName}</span> },
    { header: 'Items', render: (row) => <span>{row.items?.length}</span> },
    { header: 'Total', render: (row) => <span>${row.totalAmount?.toFixed(2)}</span> },
    { header: 'Payment', render: (row) => <StatusBadge status={row.paymentStatus} /> },
    { header: 'Status', render: (row) => <StatusBadge status={row.orderStatus} /> },
    { header: 'Date', render: (row) => <span>{new Date(row.createdAt).toLocaleDateString()}</span> },
    { header: 'Actions', render: (row) => <Link to={`/orders/${row._id}`}><HiEye /> View</Link> },
  ];

  return (
    <div>
      <h1>Orders</h1>

      <div>
        {['', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
          <button key={s} onClick={() => { setStatus(s); setPage(1); }} data-active={status === s}>{s || 'All'}</button>
        ))}
      </div>

      <DataTable columns={columns} data={items} loading={loading} emptyMessage="No orders found" />
      <Pagination pagination={pagination} onPageChange={setPage} />
    </div>
  );
}