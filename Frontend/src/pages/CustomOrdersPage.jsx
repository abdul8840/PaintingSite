import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyCustomOrders } from '../store/slices/customOrderSlice';
import OrderCard from '../components/order/OrderCard';
import Pagination from '../components/common/Pagination';
import EmptyState from '../components/common/EmptyState';
import Breadcrumb from '../components/common/Breadcrumb';
import Loader from '../components/common/Loader';
import { HiColorSwatch } from 'react-icons/hi';

export default function CustomOrdersPage() {
  const dispatch = useDispatch();
  const { items, pagination, loading } = useSelector((state) => state.customOrders);
  const [page, setPage] = useState(1);

  useEffect(() => { dispatch(fetchMyCustomOrders(`page=${page}`)); }, [dispatch, page]);

  return (
    <div>
      <Breadcrumb items={[{ label: 'Custom Orders' }]} />
      <h1>My Custom Orders</h1>
      {loading ? <Loader /> : items.length === 0 ? (
        <EmptyState icon={HiColorSwatch} title="No custom orders" description="Commission your first custom painting!" actionLabel="Order Custom Painting" actionHref="/custom-painting" />
      ) : (
        <div>{items.map((order) => <OrderCard key={order._id} order={order} isCustom />)}</div>
      )}
      <Pagination pagination={pagination} onPageChange={setPage} />
    </div>
  );
}