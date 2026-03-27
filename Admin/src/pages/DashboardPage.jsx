import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardStats } from '../store/slices/dashboardSlice';
import QuickStats from '../components/dashboard/QuickStats';
import RevenueChart from '../components/dashboard/RevenueChart';
import RecentOrders from '../components/dashboard/RecentOrders';
import TopArtworks from '../components/dashboard/TopArtworks';
import Loader from '../components/common/Loader';
import { 
  HiRefresh, 
  HiExclamationCircle, 
  HiChartBar,
  HiCalendar 
} from 'react-icons/hi';

export default function DashboardPage() {
  const dispatch = useDispatch();
  const { stats, loading, error } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  // Get current date info
  const currentDate = new Date();
  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = currentDate.toLocaleDateString('en-US', dateOptions);

  if (loading && !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <Loader text="Loading dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">Dashboard</h1>
          <p className="text-neutral-500 mt-1">{formattedDate}</p>
        </div>
        
        {/* Error State */}
        <div className="bg-white rounded-2xl border border-red-200 p-8 md:p-12 text-center 
                       shadow-sm max-w-lg mx-auto animate-scaleIn">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center 
                         justify-center mx-auto mb-4">
            <HiExclamationCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-neutral-900 mb-2">
            Failed to load dashboard
          </h2>
          <p className="text-neutral-500 mb-6">{error}</p>
          <button 
            onClick={() => dispatch(fetchDashboardStats())}
            className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 
                      text-white rounded-xl font-medium hover:bg-neutral-800 
                      transition-all cursor-pointer shadow-lg hover:shadow-xl
                      active:scale-95"
          >
            <HiRefresh className="w-5 h-5" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between 
                       gap-4 mb-6 md:mb-8 animate-slideIn">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 bg-neutral-900 rounded-xl shadow-lg">
                <HiChartBar className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">
                Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-2 text-neutral-500 ml-11">
              <HiCalendar className="w-4 h-4" />
              <p className="text-sm">{formattedDate}</p>
            </div>
          </div>
          
          <button 
            onClick={() => dispatch(fetchDashboardStats())}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 
                      bg-white border border-neutral-200 rounded-xl
                      text-sm font-medium text-neutral-700
                      hover:bg-neutral-50 hover:border-neutral-300
                      transition-all cursor-pointer shadow-sm
                      disabled:opacity-50 disabled:cursor-not-allowed
                      active:scale-95"
          >
            <HiRefresh className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>

        {/* Quick Stats */}
        <div className="mb-6 md:mb-8">
          <QuickStats stats={stats || {}} />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
          {/* Revenue Chart - Takes 2 columns on xl */}
          <div className="xl:col-span-2 animate-slideUp" style={{ animationDelay: '0.2s' }}>
            <RevenueChart data={stats?.revenueChart || []} />
          </div>
          
          {/* Top Artworks - Takes 1 column on xl */}
          <div className="animate-slideUp" style={{ animationDelay: '0.3s' }}>
            <TopArtworks artworks={stats?.topArtworks || []} />
          </div>
        </div>

        {/* Recent Orders */}
        <div className="animate-slideUp" style={{ animationDelay: '0.4s' }}>
          <RecentOrders
            orders={stats?.recentOrders || []}
            customOrders={stats?.recentCustomOrders || []}
          />
        </div>

        {/* Footer spacing */}
        <div className="h-8" />
      </div>
    </div>
  );
}