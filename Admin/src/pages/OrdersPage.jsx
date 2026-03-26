import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchOrders } from '../store/slices/orderSlice';
import DataTable from '../components/common/DataTable';
import Pagination from '../components/common/Pagination';
import StatusBadge from '../components/common/StatusBadge';
import { HiEye, HiShoppingCart, HiFilter } from 'react-icons/hi';

export default function OrdersPage() {
  const dispatch = useDispatch();
  const { items, pagination, loading } = useSelector((state) => state.orders);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const params = `page=${page}&limit=20${status ? `&status=${status}` : ''}`;
    dispatch(fetchOrders(params));
  }, [dispatch, page, status]);

  const statusFilters = [
    { value: '', label: 'All Orders', color: 'gray' },
    { value: 'pending', label: 'Pending', color: 'yellow' },
    { value: 'confirmed', label: 'Confirmed', color: 'blue' },
    { value: 'processing', label: 'Processing', color: 'purple' },
    { value: 'shipped', label: 'Shipped', color: 'indigo' },
    { value: 'delivered', label: 'Delivered', color: 'green' },
    { value: 'cancelled', label: 'Cancelled', color: 'red' },
  ];

  const columns = [
    { 
      header: 'Order #', 
      render: (row) => (
        <Link 
          to={`/orders/${row._id}`}
          className="font-mono font-semibold text-gray-900 hover:text-gray-600 transition-colors duration-200 cursor-pointer"
        >
          {row.orderNumber}
        </Link>
      )
    },
    { 
      header: 'Customer', 
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900">{row.user?.firstName} {row.user?.lastName}</p>
          <p className="text-xs text-gray-500">{row.user?.email}</p>
        </div>
      )
    },
    { 
      header: 'Items', 
      render: (row) => (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-900">
          {row.items?.length} {row.items?.length === 1 ? 'item' : 'items'}
        </span>
      )
    },
    { 
      header: 'Total', 
      render: (row) => (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-gray-900 text-white">
          ${row.totalAmount?.toFixed(2)}
        </span>
      )
    },
    { 
      header: 'Payment', 
      render: (row) => <StatusBadge status={row.paymentStatus} /> 
    },
    { 
      header: 'Status', 
      render: (row) => <StatusBadge status={row.orderStatus} /> 
    },
    { 
      header: 'Date', 
      render: (row) => (
        <span className="text-sm text-gray-600">{new Date(row.createdAt).toLocaleDateString()}</span>
      )
    },
    { 
      header: 'Actions', 
      render: (row) => (
        <Link 
          to={`/orders/${row._id}`}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-900 hover:text-white transition-all duration-200 cursor-pointer text-sm font-medium"
        >
          <HiEye className="w-4 h-4" />
          <span>View</span>
        </Link>
      )
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center shadow-lg">
                <HiShoppingCart className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              Orders
            </h1>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              Manage customer orders • {pagination?.total || 0} total orders
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6">
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Orders</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{pagination?.total || 0}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Pending</p>
              <p className="text-xl sm:text-2xl font-bold text-yellow-600">
                {items?.filter(item => item.orderStatus === 'pending').length || 0}
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Processing</p>
              <p className="text-xl sm:text-2xl font-bold text-purple-600">
                {items?.filter(item => item.orderStatus === 'processing').length || 0}
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Delivered</p>
              <p className="text-xl sm:text-2xl font-bold text-green-600">
                {items?.filter(item => item.orderStatus === 'delivered').length || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <HiFilter className="w-5 h-5 text-gray-600" />
            <h3 className="text-sm sm:text-base font-semibold text-gray-900">Filter by Status</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {statusFilters.map((filter) => (
              <button 
                key={filter.value}
                onClick={() => { setStatus(filter.value); setPage(1); }}
                className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                  status === filter.value
                    ? 'bg-gray-900 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
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
              emptyMessage="No orders found" 
            />
          </div>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="border-t border-gray-200 p-4 sm:p-6 bg-gray-50">
              <Pagination pagination={pagination} onPageChange={setPage} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}