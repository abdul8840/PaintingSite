import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyOrders } from '../store/slices/orderSlice';
import OrderCard from '../components/order/OrderCard';
import Pagination from '../components/common/Pagination';
import EmptyState from '../components/common/EmptyState';
import Breadcrumb from '../components/common/Breadcrumb';
import Loader from '../components/common/Loader';
import { HiShoppingBag } from 'react-icons/hi';

export default function OrdersPage() {
  const dispatch = useDispatch();
  const { items, pagination, loading } = useSelector((state) => state.orders);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const params = `page=${page}${status ? `&status=${status}` : ''}`;
    dispatch(fetchMyOrders(params));
  }, [dispatch, page, status]);

  return (
    <div>
      <Breadcrumb items={[{ label: 'My Orders' }]} />
      <h1>My Orders</h1>

      <div>
        {['', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((s) => (
          <button key={s} onClick={() => { setStatus(s); setPage(1); }} data-active={status === s}>
            {s || 'All'}
          </button>
        ))}
      </div>

      {loading ? <Loader /> : items.length === 0 ? (
        <EmptyState icon={HiShoppingBag} title="No orders found" description="Start shopping to see your orders here." actionLabel="Shop Now" actionHref="/shop" />
      ) : (
        <div>
          {items.map((order) => <OrderCard key={order._id} order={order} />)}
        </div>
      )}

      <Pagination pagination={pagination} onPageChange={setPage} />
    </div>
  );
}