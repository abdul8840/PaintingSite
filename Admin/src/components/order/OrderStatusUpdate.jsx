import { useState } from 'react';
import { HiRefresh, HiTruck, HiLink, HiAnnotation } from 'react-icons/hi';

const STATUSES = [
  { value: 'pending', label: 'Pending', color: 'warning' },
  { value: 'confirmed', label: 'Confirmed', color: 'info' },
  { value: 'processing', label: 'Processing', color: 'info' },
  { value: 'shipped', label: 'Shipped', color: 'primary' },
  { value: 'delivered', label: 'Delivered', color: 'success' },
  { value: 'cancelled', label: 'Cancelled', color: 'error' },
];

export default function OrderStatusUpdate({ currentStatus, onUpdate, loading }) {
  const [status, setStatus] = useState(currentStatus);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingUrl, setTrackingUrl] = useState('');
  const [note, setNote] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({ 
      status, 
      trackingNumber: trackingNumber || undefined, 
      trackingUrl: trackingUrl || undefined, 
      note: note || undefined 
    });
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

  const currentStatusInfo = STATUSES.find(s => s.value === currentStatus);

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-border-light">
        <div className="w-10 h-10 bg-theme-primary rounded-lg flex items-center justify-center">
          <HiRefresh className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-text-primary">Update Order Status</h3>
          <p className="text-sm text-text-muted">
            Current: <span className="font-medium text-text-primary capitalize">{currentStatusInfo?.label || currentStatus}</span>
          </p>
        </div>
      </div>

      {/* Status Selection */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-text-primary mb-1.5">
          <HiRefresh className="w-4 h-4 text-text-muted" />
          New Status
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className={selectClass}
        >
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
        
        {/* Status Progress Indicator */}
        <div className="mt-3 flex items-center gap-1">
          {STATUSES.slice(0, -1).map((s, i) => {
            const isActive = STATUSES.findIndex(st => st.value === status) >= i;
            const isCancelled = status === 'cancelled';
            return (
              <div 
                key={s.value}
                className={`
                  flex-1 h-1.5 rounded-full
                  transition-colors duration-300
                  ${isCancelled ? 'bg-error/30' : isActive ? 'bg-success' : 'bg-bg-tertiary'}
                `}
              />
            );
          })}
        </div>
      </div>

      {/* Shipping Details - Show when shipped */}
      {status === 'shipped' && (
        <div className="space-y-4 p-4 bg-bg-secondary rounded-xl border border-border-light animate-fadeIn">
          <h4 className="text-sm font-semibold text-text-primary flex items-center gap-2">
            <HiTruck className="w-4 h-4" />
            Shipping Details
          </h4>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              Tracking Number
            </label>
            <input
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Enter tracking number"
              className={inputClass}
            />
          </div>
          
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-text-primary mb-1.5">
              <HiLink className="w-4 h-4 text-text-muted" />
              Tracking URL
            </label>
            <input
              value={trackingUrl}
              onChange={(e) => setTrackingUrl(e.target.value)}
              placeholder="https://tracking.example.com/..."
              className={inputClass}
            />
          </div>
        </div>
      )}

      {/* Note */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-text-primary mb-1.5">
          <HiAnnotation className="w-4 h-4 text-text-muted" />
          Note
          <span className="text-text-muted font-normal">(Optional)</span>
        </label>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add a note for this status update"
          className={inputClass}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || status === currentStatus}
        className="
          w-full
          px-6 py-3
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
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Updating...
          </>
        ) : (
          <>
            <HiRefresh className="w-5 h-5" />
            Update Status
          </>
        )}
      </button>

      {status === currentStatus && (
        <p className="text-center text-sm text-text-muted">
          Select a different status to update
        </p>
      )}
    </form>
  );
}