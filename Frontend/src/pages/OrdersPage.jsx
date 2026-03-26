import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchMyOrders } from '../store/slices/orderSlice';
import OrderCard from '../components/order/OrderCard';
import Pagination from '../components/common/Pagination';
import EmptyState from '../components/common/EmptyState';
import Breadcrumb from '../components/common/Breadcrumb';
import Loader from '../components/common/Loader';
import { HiShoppingBag, HiFilter, HiRefresh } from 'react-icons/hi';

const STATUS_FILTERS = [
  { value: '', label: 'All Orders', color: 'charcoal' },
  { value: 'pending', label: 'Pending', color: 'gold' },
  { value: 'confirmed', label: 'Confirmed', color: 'sage' },
  { value: 'shipped', label: 'Shipped', color: 'rust' },
  { value: 'delivered', label: 'Delivered', color: 'sage' },
  { value: 'cancelled', label: 'Cancelled', color: 'mist' },
];

export default function OrdersPage() {
  const dispatch = useDispatch();
  const { items, pagination, loading } = useSelector((state) => state.orders);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const params = `page=${page}${status ? `&status=${status}` : ''}`;
    dispatch(fetchMyOrders(params));
  }, [dispatch, page, status]);

  const handleFilterChange = (newStatus) => {
    setStatus(newStatus);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRefresh = () => {
    const params = `page=${page}${status ? `&status=${status}` : ''}`;
    dispatch(fetchMyOrders(params));
  };

  return (
    <div className="min-h-screen bg-paper">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb items={[{ label: 'My Orders' }]} />
        </div>
      </div>

      {/* Header */}
      <div className="bg-white border-b border-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in-up">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-sage/20 to-sage/10 rounded-xl flex items-center justify-center">
                <HiShoppingBag className="w-6 h-6 sm:w-7 sm:h-7 text-sage" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-ink">My Orders</h1>
                <p className="text-sm sm:text-base text-charcoal/60 mt-1">
                  {pagination?.total || 0} order{pagination?.total !== 1 ? 's' : ''} in total
                </p>
              </div>
            </div>

            <button
              onClick={handleRefresh}
              className="flex items-center justify-center gap-2 px-4 py-2.5 text-charcoal/70 hover:text-ink hover:bg-cream rounded-xl transition-all duration-300 cursor-pointer"
            >
              <HiRefresh className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              <span className="text-sm font-medium">Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-cream sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 py-4 overflow-x-auto scrollbar-none">
            <div className="flex items-center gap-2 text-charcoal/50 mr-2 flex-shrink-0">
              <HiFilter className="w-4 h-4" />
              <span className="text-sm hidden sm:inline">Filter:</span>
            </div>
            
            {STATUS_FILTERS.map((filter, index) => (
              <button 
                key={filter.value} 
                onClick={() => handleFilterChange(filter.value)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer whitespace-nowrap ${
                  status === filter.value
                    ? 'bg-ink text-white shadow-lg shadow-ink/20'
                    : 'bg-cream/50 text-charcoal/70 hover:bg-cream hover:text-ink'
                }`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader text="Loading your orders..." />
          </div>
        ) : items.length === 0 ? (
          <div className="animate-fade-in-up">
            <EmptyState 
              icon={HiShoppingBag} 
              title={status ? `No ${status} orders` : "No orders yet"} 
              description={status ? `You don't have any ${status} orders.` : "Start shopping to see your orders here."} 
              actionLabel="Shop Now" 
              actionHref="/shop" 
            />
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {items.map((order, index) => (
              <div 
                key={order._id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <OrderCard order={order} />
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="mt-10 sm:mt-12 flex justify-center animate-fade-in-up">
            <Pagination pagination={pagination} onPageChange={handlePageChange} />
          </div>
        )}
      </div>
    </div>
  );
}