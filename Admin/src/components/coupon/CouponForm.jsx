import { useState, useEffect } from 'react';

export default function CouponForm({ initialData, onSubmit, loading, onCancel }) {
  const [form, setForm] = useState({
    code: '', description: '', discountType: 'percentage', discountValue: '',
    minimumOrderAmount: 0, maximumDiscount: '', usageLimit: '',
    perUserLimit: 1, applicableTo: 'all',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    isActive: true,
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        code: initialData.code || '',
        description: initialData.description || '',
        discountType: initialData.discountType || 'percentage',
        discountValue: initialData.discountValue || '',
        minimumOrderAmount: initialData.minimumOrderAmount || 0,
        maximumDiscount: initialData.maximumDiscount || '',
        usageLimit: initialData.usageLimit || '',
        perUserLimit: initialData.perUserLimit || 1,
        applicableTo: initialData.applicableTo || 'all',
        startDate: initialData.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : '',
        endDate: initialData.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : '',
        isActive: initialData.isActive ?? true,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...form,
      discountValue: Number(form.discountValue),
      minimumOrderAmount: Number(form.minimumOrderAmount),
      maximumDiscount: form.maximumDiscount ? Number(form.maximumDiscount) : undefined,
      usageLimit: form.usageLimit ? Number(form.usageLimit) : undefined,
      perUserLimit: Number(form.perUserLimit),
      startDate: new Date(form.startDate),
      endDate: new Date(form.endDate),
    };
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <div>
          <label>Code *</label>
          <input name="code" value={form.code} onChange={handleChange} required placeholder="SUMMER20" style={{ textTransform: 'uppercase' }} />
        </div>
        <div>
          <label>Description</label>
          <input name="description" value={form.description} onChange={handleChange} />
        </div>
      </div>
      <div>
        <div>
          <label>Discount Type *</label>
          <select name="discountType" value={form.discountType} onChange={handleChange}>
            <option value="percentage">Percentage (%)</option>
            <option value="fixed">Fixed Amount ($)</option>
          </select>
        </div>
        <div>
          <label>Discount Value *</label>
          <input name="discountValue" type="number" value={form.discountValue} onChange={handleChange} required min="0" />
        </div>
      </div>
      <div>
        <div>
          <label>Minimum Order ($)</label>
          <input name="minimumOrderAmount" type="number" value={form.minimumOrderAmount} onChange={handleChange} min="0" />
        </div>
        <div>
          <label>Max Discount ($)</label>
          <input name="maximumDiscount" type="number" value={form.maximumDiscount} onChange={handleChange} min="0" />
        </div>
      </div>
      <div>
        <div>
          <label>Usage Limit</label>
          <input name="usageLimit" type="number" value={form.usageLimit} onChange={handleChange} min="1" />
        </div>
        <div>
          <label>Per User Limit</label>
          <input name="perUserLimit" type="number" value={form.perUserLimit} onChange={handleChange} min="1" />
        </div>
        <div>
          <label>Applicable To</label>
          <select name="applicableTo" value={form.applicableTo} onChange={handleChange}>
            <option value="all">All Orders</option>
            <option value="artwork">Artwork Only</option>
            <option value="custom-order">Custom Orders Only</option>
          </select>
        </div>
      </div>
      <div>
        <div>
          <label>Start Date *</label>
          <input name="startDate" type="date" value={form.startDate} onChange={handleChange} required />
        </div>
        <div>
          <label>End Date *</label>
          <input name="endDate" type="date" value={form.endDate} onChange={handleChange} required />
        </div>
      </div>
      <div>
        <label><input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} /> Active</label>
      </div>
      <div>
        {onCancel && <button type="button" onClick={onCancel}>Cancel</button>}
        <button type="submit" disabled={loading}>{loading ? 'Saving...' : initialData ? 'Update Coupon' : 'Create Coupon'}</button>
      </div>
    </form>
  );
}