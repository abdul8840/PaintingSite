import { useState, useEffect } from 'react';
import { HiCollection, HiX } from 'react-icons/hi';

export default function CategoryForm({ initialData, onSubmit, loading, onCancel }) {
  const [form, setForm] = useState({ 
    name: '', 
    description: '', 
    sortOrder: 0, 
    isActive: true 
  });

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
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-1.5">
          Name <span className="text-error">*</span>
        </label>
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          placeholder="Enter category name"
          className="
            w-full px-4 py-2.5
            text-sm text-text-primary
            placeholder:text-text-muted
            bg-bg-primary
            border border-border-light rounded-lg
            transition-all duration-200
            hover:border-border-medium
            focus:outline-none focus:border-theme-secondary focus:ring-2 focus:ring-theme-secondary/20
          "
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-1.5">
          Description
        </label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={3}
          placeholder="Brief description of the category"
          className="
            w-full px-4 py-2.5
            text-sm text-text-primary
            placeholder:text-text-muted
            bg-bg-primary
            border border-border-light rounded-lg
            transition-all duration-200
            hover:border-border-medium
            focus:outline-none focus:border-theme-secondary focus:ring-2 focus:ring-theme-secondary/20
            resize-none
          "
        />
      </div>

      {/* Sort Order & Active */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            Sort Order
          </label>
          <input
            type="number"
            value={form.sortOrder}
            onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
            placeholder="0"
            className="
              w-full px-4 py-2.5
              text-sm text-text-primary
              placeholder:text-text-muted
              bg-bg-primary
              border border-border-light rounded-lg
              transition-all duration-200
              hover:border-border-medium
              focus:outline-none focus:border-theme-secondary focus:ring-2 focus:ring-theme-secondary/20
            "
          />
          <p className="mt-1 text-xs text-text-muted">Lower numbers appear first</p>
        </div>

        <div className="flex items-center">
          <label className="
            flex items-center gap-3 
            p-4 
            bg-bg-secondary rounded-lg border border-border-light
            cursor-pointer
            hover:border-theme-secondary
            transition-colors duration-200
            w-full
          ">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className="
                w-5 h-5
                rounded
                border-border-medium
                text-theme-primary
                focus:ring-theme-secondary focus:ring-offset-0
                cursor-pointer
              "
            />
            <div>
              <span className="block text-sm font-medium text-text-primary">Active</span>
              <span className="block text-xs text-text-muted">Visible in store</span>
            </div>
          </label>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-border-light">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="
              flex-1 sm:flex-none
              px-4 sm:px-6 py-2.5
              bg-bg-tertiary hover:bg-bg-hover
              text-text-primary font-medium
              rounded-lg
              border border-border-medium
              transition-all duration-200
              cursor-pointer
              flex items-center justify-center gap-2
            "
          >
            <HiX className="w-4 h-4" />
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="
            flex-1 sm:flex-none
            px-4 sm:px-6 py-2.5
            bg-theme-primary hover:bg-theme-accent
            text-white font-medium
            rounded-lg
            transition-all duration-200
            cursor-pointer
            disabled:opacity-50 disabled:cursor-not-allowed
            flex items-center justify-center gap-2
          "
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <HiCollection className="w-4 h-4" />
              {initialData ? 'Update Category' : 'Create Category'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}