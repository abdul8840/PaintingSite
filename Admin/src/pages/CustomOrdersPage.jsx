import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchCustomOrders } from '../store/slices/customOrderSlice';
import DataTable from '../components/common/DataTable';
import Pagination from '../components/common/Pagination';
import StatusBadge from '../components/common/StatusBadge';
import Loader from '../components/common/Loader';
import { HiEye, HiFilter } from 'react-icons/hi';

export default function CustomOrdersPage() {
  const dispatch = useDispatch();
  const { items, pagination, loading, error } = useSelector((state) => state.customOrders);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', 20);
    if (status) params.append('status', status);
    
    console.log('Dispatching fetchCustomOrders with params:', params.toString());
    dispatch(fetchCustomOrders(params.toString()));
  }, [dispatch, page, status]);

  // Debug logging
  console.log('CustomOrdersPage state:', { loading, itemsCount: items?.length, pagination, error });

  const columns = [
    { 
      header: 'Order #', 
      render: (row) => (
        <Link to={`/custom-orders/${row._id}`} className="text-blue-600 hover:text-blue-800 font-medium">
          {row.orderNumber}
        </Link>
      ) 
    },
    { 
      header: 'Customer', 
      render: (row) => (
        <span>{row.user?.firstName} {row.user?.lastName}</span>
      ) 
    },
    { 
      header: 'Style', 
      render: (row) => <span className="capitalize">{row.sketchStyle?.replace(/-/g, ' ')}</span> 
    },
    { 
      header: 'Size', 
      render: (row) => <span>{row.canvasSize}</span> 
    },
    { 
      header: 'Artist', 
      render: (row) => (
        <span>{row.assignedArtist ? `${row.assignedArtist.firstName} ${row.assignedArtist.lastName}` : 'Unassigned'}</span>
      ) 
    },
    { 
      header: 'Total', 
      render: (row) => <span className="font-semibold">${row.totalAmount?.toFixed(2)}</span> 
    },
    { 
      header: 'Status', 
      render: (row) => <StatusBadge status={row.status} /> 
    },
    { 
      header: 'Date', 
      render: (row) => <span>{new Date(row.createdAt).toLocaleDateString()}</span> 
    },
    { 
      header: 'Actions', 
      render: (row) => (
        <Link 
          to={`/custom-orders/${row._id}`}
          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800"
        >
          <HiEye className="w-4 h-4" />
          View
        </Link>
      ) 
    },
  ];

  const statusFilters = [
    { value: '', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'review', label: 'Review' },
    { value: 'completed', label: 'Completed' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  if (loading && items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader />
          <p className="mt-4 text-gray-600">Loading custom orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Orders</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => {
              const params = new URLSearchParams();
              params.append('page', page);
              params.append('limit', 20);
              if (status) params.append('status', status);
              dispatch(fetchCustomOrders(params.toString()));
            }}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Custom Orders</h1>
          <p className="text-gray-600 mt-2">Manage all custom painting orders</p>
        </div>

        {/* Status Filters */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap items-center gap-2">
            <HiFilter className="w-5 h-5 text-gray-500 mr-2" />
            {statusFilters.map((filter) => (
              <button
                key={filter.value || 'all'}
                onClick={() => {
                  setStatus(filter.value);
                  setPage(1);
                }}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${status === filter.value 
                    ? 'bg-gray-900 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <DataTable 
            columns={columns} 
            data={items || []} 
            loading={loading} 
            emptyMessage="No custom orders found"
          />
        </div>

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="mt-6">
            <Pagination 
              pagination={pagination} 
              onPageChange={(newPage) => {
                setPage(newPage);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
            />
          </div>
        )}
      </div>
    </div>
  );
}