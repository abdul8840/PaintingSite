import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '../store/slices/categorySlice';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import CategoryForm from '../components/category/CategoryForm';
import StatusBadge from '../components/common/StatusBadge';
import { useToast } from '../hooks/useToast';
import { HiPlus, HiPencil, HiTrash } from 'react-icons/hi';

export default function CategoriesPage() {
  const dispatch = useDispatch();
  const toast = useToast();
  const { items, loading, formLoading } = useSelector((state) => state.categories);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => { dispatch(fetchCategories()); }, [dispatch]);

  const handleCreate = async (data) => {
    try {
      await dispatch(createCategory(data)).unwrap();
      toast.success('Category created!');
      setShowForm(false);
    } catch (err) { toast.error(err); }
  };

  const handleUpdate = async (data) => {
    try {
      await dispatch(updateCategory({ id: editing._id, data })).unwrap();
      toast.success('Category updated!');
      setEditing(null);
    } catch (err) { toast.error(err); }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteCategory(deleteId)).unwrap();
      toast.success('Category deleted');
    } catch (err) { toast.error(err); }
    setDeleteId(null);
  };

  const columns = [
    { header: 'Name', render: (row) => <span>{row.name}</span> },
    { header: 'Slug', render: (row) => <span>{row.slug}</span> },
    { header: 'Description', render: (row) => <span>{row.description?.substring(0, 50)}...</span> },
    { header: 'Order', render: (row) => <span>{row.sortOrder}</span> },
    { header: 'Status', render: (row) => <StatusBadge status={row.isActive ? 'active' : 'inactive'} /> },
    {
      header: 'Actions',
      render: (row) => (
        <div>
          <button onClick={() => setEditing(row)}><HiPencil /></button>
          <button onClick={() => setDeleteId(row._id)}><HiTrash /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div>
        <h1>Categories</h1>
        <button onClick={() => setShowForm(true)}><HiPlus /> Add Category</button>
      </div>

      <DataTable columns={columns} data={items} loading={loading} emptyMessage="No categories found" />

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Create Category">
        <CategoryForm onSubmit={handleCreate} loading={formLoading} onCancel={() => setShowForm(false)} />
      </Modal>

      <Modal isOpen={!!editing} onClose={() => setEditing(null)} title="Edit Category">
        <CategoryForm initialData={editing} onSubmit={handleUpdate} loading={formLoading} onCancel={() => setEditing(null)} />
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Category" message="Are you sure? This will not delete associated artworks." confirmText="Delete" />
    </div>
  );
}