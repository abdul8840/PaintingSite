import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchArtworks, deleteArtwork } from '../store/slices/artworkSlice';
import DataTable from '../components/common/DataTable';
import Pagination from '../components/common/Pagination';
import SearchInput from '../components/common/SearchInput';
import StatusBadge from '../components/common/StatusBadge';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { useToast } from '../hooks/useToast';
import { HiPlus, HiPencil, HiTrash, HiPhotograph, HiFilter } from 'react-icons/hi';

export default function ArtworksPage() {
  const dispatch = useDispatch();
  const toast = useToast();
  const { items, pagination, loading } = useSelector((state) => state.artworks);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    const params = `page=${page}&limit=15${search ? `&search=${search}` : ''}`;
    dispatch(fetchArtworks(params));
  }, [dispatch, page, search]);

  const handleDelete = async () => {
    try {
      await dispatch(deleteArtwork(deleteId)).unwrap();
      toast.success('Artwork deleted');
    } catch (err) {
      toast.error(err);
    }
    setDeleteId(null);
  };

  const columns = [
    {
      header: 'Image',
      render: (row) => (
        <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden bg-gray-100 group">
          {row.images?.[0]?.url ? (
            <img 
              src={row.images[0].url} 
              alt={row.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <HiPhotograph className="w-6 h-6 text-gray-400" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
        </div>
      ),
    },
    { 
      header: 'Title', 
      render: (row) => (
        <div className="min-w-[150px] max-w-[250px]">
          <p className="font-semibold text-gray-900 truncate">{row.title}</p>
          <p className="text-xs text-gray-500 truncate mt-0.5">{row.category?.name || 'No category'}</p>
        </div>
      )
    },
    { 
      header: 'Price', 
      render: (row) => (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-900">
          ${row.price?.toFixed(2)}
        </span>
      )
    },
    { 
      header: 'Stock', 
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${row.stock > 10 ? 'bg-green-500' : row.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
          <span className="font-medium text-gray-900">{row.stock}</span>
        </div>
      )
    },
    { 
      header: 'Sold', 
      render: (row) => (
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium bg-gray-900 text-white">
          {row.sold}
        </span>
      )
    },
    { 
      header: 'Status', 
      render: (row) => <StatusBadge status={row.isActive ? 'active' : 'inactive'} /> 
    },
    { 
      header: 'Featured', 
      render: (row) => (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${
          row.isFeatured 
            ? 'bg-gray-900 text-white' 
            : 'bg-gray-100 text-gray-600'
        }`}>
          {row.isFeatured ? '⭐ Yes' : 'No'}
        </span>
      )
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Link 
            to={`/artworks/edit/${row._id}`}
            className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-900 hover:text-white transition-all duration-200 cursor-pointer group"
            title="Edit"
          >
            <HiPencil className="w-4 h-4" />
          </Link>
          <button 
            onClick={() => setDeleteId(row._id)}
            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-200 cursor-pointer"
            title="Delete"
          >
            <HiTrash className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6">
            {/* Title Section */}
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center shadow-lg">
                  <HiPhotograph className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                Artworks
              </h1>
              <p className="mt-2 text-sm sm:text-base text-gray-600">
                Manage your artwork collection • {pagination?.total || 0} total artworks
              </p>
            </div>

            {/* Action Button */}
            <Link 
              to="/artworks/create"
              className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 cursor-pointer"
            >
              <HiPlus className="w-5 h-5" />
              <span className="text-sm sm:text-base">Add Artwork</span>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6">
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Artworks</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{pagination?.total || 0}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Active</p>
              <p className="text-xl sm:text-2xl font-bold text-green-600">
                {items?.filter(item => item.isActive).length || 0}
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Featured</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {items?.filter(item => item.isFeatured).length || 0}
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Low Stock</p>
              <p className="text-xl sm:text-2xl font-bold text-red-600">
                {items?.filter(item => item.stock < 5).length || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <SearchInput 
                value={search} 
                onChange={(v) => { setSearch(v); setPage(1); }} 
                placeholder="Search by title, category, or price..." 
              />
            </div>
            <button className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:border-gray-900 hover:text-gray-900 transition-all duration-200 cursor-pointer">
              <HiFilter className="w-5 h-5" />
              <span className="text-sm sm:text-base">Filters</span>
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Decorative Header */}
          <div className="h-2 bg-gradient-to-r from-gray-800 via-gray-900 to-black"></div>
          
          {/* Table Content */}
          <div className="overflow-x-auto">
            <DataTable 
              columns={columns} 
              data={items} 
              loading={loading} 
              emptyMessage="No artworks found. Create your first artwork to get started!" 
            />
          </div>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="border-t border-gray-200 p-4 sm:p-6 bg-gray-50">
              <Pagination pagination={pagination} onPageChange={setPage} />
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center">
          <p className="text-xs sm:text-sm text-gray-500">
            Showing {items?.length || 0} of {pagination?.total || 0} artworks
          </p>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Artwork"
        message="Are you sure you want to delete this artwork? This action cannot be undone and will permanently remove the artwork from your collection."
        confirmText="Delete"
      />
    </div>
  );
}