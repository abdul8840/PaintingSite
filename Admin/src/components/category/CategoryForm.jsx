import { useState, useEffect } from 'react';

export default function CategoryForm({ initialData, onSubmit, loading, onCancel }) {
  const [form, setForm] = useState({ name: '', description: '', sortOrder: 0, isActive: true });

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        description: initialData.description || '',
        sortOrder: initialData.sortOrder || 0,
        isActive: initialData.isActive ?? true,
      });
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name *</label>
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
      </div>
      <div>
        <label>Description</label>
        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
      </div>
      <div>
        <div>
          <label>Sort Order</label>
          <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} />
        </div>
        <div>
          <label><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> Active</label>
        </div>
      </div>
      <div>
        {onCancel && <button type="button" onClick={onCancel}>Cancel</button>}
        <button type="submit" disabled={loading}>{loading ? 'Saving...' : initialData ? 'Update' : 'Create'}</button>
      </div>
    </form>
  );
}