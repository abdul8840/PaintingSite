import { useState, useEffect } from 'react';
import { HiTicket, HiX } from 'react-icons/hi';

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

  const inputClass = `
    w-full px-4 py-2.5
    text-sm text-text-primary
    placeholder:text-text-muted
    bg-bg-primary
    border border-border-light rounded-lg
    transition-all duration-200
    hover:border-border-medium
    focus:outline-none focus:border-theme-secondary focus:ring-2 focus:ring-theme-secondary/20
  `;

  const selectClass = `
    ${inputClass}
    cursor-pointer
    appearance-none
    bg-[url('data:image/svg+xml;charset=US-ASCII,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 20 20%22 fill=%22%236b7280%22><path fill-rule=%22evenodd%22 d=%22M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z%22 clip-rule=%22evenodd%22/></svg>')]
    bg-no-repeat bg-[right_0.75rem_center] bg-[length:1.25rem_1.25rem]
  `;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Code & Description */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            Coupon Code <span className="text-error">*</span>
          </label>
          <input
            name="code"
            value={form.code}
            onChange={handleChange}
            required
            placeholder="SUMMER20"
            className={`${inputClass} uppercase`}
          />
          <p className="mt-1 text-xs text-text-muted">Customers will enter this code</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            Description
          </label>
          <input
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Summer sale discount"
            className={inputClass}
          />
        </div>
      </div>

      {/* Discount Type & Value */}
      <div className="p-4 bg-bg-secondary rounded-xl border border-border-light">
        <h4 className="text-sm font-semibold text-text-primary mb-4">Discount Details</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              Discount Type <span className="text-error">*</span>
            </label>
            <select
              name="discountType"
              value={form.discountType}
              onChange={handleChange}
              className={selectClass}
            >
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount ($)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              Discount Value <span className="text-error">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
                {form.discountType === 'percentage' ? '%' : '$'}
              </span>
              <input
                name="discountValue"
                type="number"
                value={form.discountValue}
                onChange={handleChange}
                required
                min="0"
                placeholder="0"
                className={`${inputClass} pl-8`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Limits */}
      <div className="p-4 bg-bg-secondary rounded-xl border border-border-light">
        <h4 className="text-sm font-semibold text-text-primary mb-4">Order Limits</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              Minimum Order Amount ($)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">$</span>
              <input
                name="minimumOrderAmount"
                type="number"
                value={form.minimumOrderAmount}
                onChange={handleChange}
                min="0"
                placeholder="0"
                className={`${inputClass} pl-8`}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              Maximum Discount ($)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">$</span>
              <input
                name="maximumDiscount"
                type="number"
                value={form.maximumDiscount}
                onChange={handleChange}
                min="0"
                placeholder="No limit"
                className={`${inputClass} pl-8`}
              />
            </div>
            <p className="mt-1 text-xs text-text-muted">Leave empty for no limit</p>
          </div>
        </div>
      </div>

      {/* Usage Limits */}
      <div className="p-4 bg-bg-secondary rounded-xl border border-border-light">
        <h4 className="text-sm font-semibold text-text-primary mb-4">Usage Limits</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              Total Usage Limit
            </label>
            <input
              name="usageLimit"
              type="number"
              value={form.usageLimit}
              onChange={handleChange}
              min="1"
              placeholder="Unlimited"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              Per User Limit
            </label>
            <input
              name="perUserLimit"
              type="number"
              value={form.perUserLimit}
              onChange={handleChange}
              min="1"
              placeholder="1"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              Applicable To
            </label>
            <select
              name="applicableTo"
              value={form.applicableTo}
              onChange={handleChange}
              className={selectClass}
            >
              <option value="all">All Orders</option>
              <option value="artwork">Artwork Only</option>
              <option value="custom-order">Custom Orders Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Dates */}
      <div className="p-4 bg-bg-secondary rounded-xl border border-border-light">
        <h4 className="text-sm font-semibold text-text-primary mb-4">Validity Period</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              Start Date <span className="text-error">*</span>
            </label>
            <input
              name="startDate"
              type="date"
              value={form.startDate}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              End Date <span className="text-error">*</span>
            </label>
            <input
              name="endDate"
              type="date"
              value={form.endDate}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Active Toggle */}
      <label className="
        flex items-center gap-3 
        p-4 
        bg-bg-secondary rounded-xl border border-border-light
        cursor-pointer
        hover:border-theme-secondary
        transition-colors duration-200
      ">
        <input
          type="checkbox"
          name="isActive"
          checked={form.isActive}
          onChange={handleChange}
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
          <span className="block text-sm font-medium text-text-primary">Active Coupon</span>
          <span className="block text-xs text-text-muted">Customers can use this coupon</span>
        </div>
      </label>

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
              <HiTicket className="w-4 h-4" />
              {initialData ? 'Update Coupon' : 'Create Coupon'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}