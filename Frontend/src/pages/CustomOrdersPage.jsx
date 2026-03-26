import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyCustomOrders } from '../store/slices/customOrderSlice';
import OrderCard from '../components/order/OrderCard';
import Pagination from '../components/common/Pagination';
import EmptyState from '../components/common/EmptyState';
import Breadcrumb from '../components/common/Breadcrumb';
import Loader from '../components/common/Loader';
import { HiColorSwatch, HiPlus, HiFilter } from 'react-icons/hi';
import { Link } from 'react-router-dom';

export default function CustomOrdersPage() {
  const dispatch = useDispatch();
  const { items, pagination, loading } = useSelector((state) => state.customOrders);
  const [page, setPage] = useState(1);

  useEffect(() => { 
    dispatch(fetchMyCustomOrders(`page=${page}`)); 
  }, [dispatch, page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-paper">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb items={[{ label: 'Custom Orders' }]} />
        </div>
      </div>

      {/* Header */}
      <div className="bg-white border-b border-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in-up">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-rust/20 to-rust/10 rounded-xl flex items-center justify-center">
                <HiColorSwatch className="w-6 h-6 sm:w-7 sm:h-7 text-rust" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-ink">My Custom Orders</h1>
                <p className="text-sm sm:text-base text-charcoal/60 mt-1">
                  {pagination?.total || 0} order{pagination?.total !== 1 ? 's' : ''} in total
                </p>
              </div>
            </div>
            
            <Link 
              to="/custom-painting"
              className="flex items-center justify-center gap-2 px-5 sm:px-6 py-3 bg-ink text-white rounded-xl font-medium hover:bg-charcoal transition-all duration-300 hover:shadow-lg hover:shadow-ink/20 cursor-pointer active:scale-[0.98]"
            >
              <HiPlus className="w-5 h-5" />
              <span>New Custom Order</span>
            </Link>
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
              icon={HiColorSwatch} 
              title="No custom orders yet" 
              description="Commission your first custom painting and bring your vision to life!" 
              actionLabel="Order Custom Painting" 
              actionHref="/custom-painting" 
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
                <OrderCard order={order} isCustom />
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