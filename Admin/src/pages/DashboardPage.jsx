import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardStats } from '../store/slices/dashboardSlice';
import QuickStats from '../components/dashboard/QuickStats';
import RevenueChart from '../components/dashboard/RevenueChart';
import RecentOrders from '../components/dashboard/RecentOrders';
import TopArtworks from '../components/dashboard/TopArtworks';
import Loader from '../components/common/Loader';
import { 
  HiChartBar, 
  HiRefresh, 
  HiTrendingUp, 
  HiCurrencyDollar,
  HiShoppingCart,
  HiUsers,
  HiPhotograph
} from 'react-icons/hi';

export default function DashboardPage() {
  const dispatch = useDispatch();
  const { stats, loading } = useSelector((state) => state.dashboard);

  useEffect(() => { 
    dispatch(fetchDashboardStats()); 
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchDashboardStats());
  };

  if (loading && !stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader text="Loading dashboard..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center shadow-lg">
                  <HiChartBar className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                Dashboard
              </h1>
              <p className="mt-2 text-sm sm:text-base text-gray-600">
                Welcome back! Here's what's happening with your store today.
              </p>
            </div>

            <button
              onClick={handleRefresh}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-gray-900 hover:text-gray-900 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <HiRefresh className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              <span className="text-sm sm:text-base">Refresh</span>
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mb-6 sm:mb-8">
          <QuickStats stats={stats} />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Revenue Chart - 2 columns */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600"></div>
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <HiTrendingUp className="w-6 h-6 text-green-600" />
                  <h3 className="text-lg font-bold text-gray-900">Revenue Overview</h3>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                  Last 30 Days
                </span>
              </div>
              <RevenueChart data={stats?.revenueChart} />
            </div>
          </div>

          {/* Top Artworks - 1 column */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-purple-600 to-indigo-600"></div>
            <div className="p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <HiPhotograph className="w-6 h-6 text-purple-600" />
                <h3 className="text-lg font-bold text-gray-900">Top Artworks</h3>
              </div>
              <TopArtworks artworks={stats?.topArtworks} />
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-gray-800 via-gray-900 to-black"></div>
          <div className="p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4">
              <HiShoppingCart className="w-6 h-6 text-gray-700" />
              <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
            </div>
            <RecentOrders 
              orders={stats?.recentOrders} 
              customOrders={stats?.recentCustomOrders} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}