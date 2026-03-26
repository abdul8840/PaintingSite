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
import { HiPlus, HiPencil, HiTrash } from 'react-icons/hi';

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
      render: (row) => <img src={row.images?.[0]?.url || ''} alt="" style={{ width: 50, height: 50, objectFit: 'cover' }} />,
    },
    { header: 'Title', render: (row) => <span>{row.title}</span> },
    { header: 'Price', render: (row) => <span>${row.price?.toFixed(2)}</span> },
    { header: 'Stock', render: (row) => <span>{row.stock}</span> },
    { header: 'Sold', render: (row) => <span>{row.sold}</span> },
    { header: 'Category', render: (row) => <span>{row.category?.name}</span> },
    { header: 'Status', render: (row) => <StatusBadge status={row.isActive ? 'active' : 'inactive'} /> },
    { header: 'Featured', render: (row) => <span>{row.isFeatured ? 'Yes' : 'No'}</span> },
    {
      header: 'Actions',
      render: (row) => (
        <div>
          <Link to={`/artworks/edit/${row._id}`}><HiPencil /></Link>
          <button onClick={() => setDeleteId(row._id)}><HiTrash /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div>
        <h1>Artworks</h1>
        <Link to="/artworks/create"><HiPlus /> Add Artwork</Link>
      </div>

      <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search artworks..." />

      <DataTable columns={columns} data={items} loading={loading} emptyMessage="No artworks found" />
      <Pagination pagination={pagination} onPageChange={setPage} />

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Artwork"
        message="Are you sure? This action cannot be undone."
        confirmText="Delete"
      />
    </div>
  );
}