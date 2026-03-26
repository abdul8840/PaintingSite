import { useState } from 'react';

const STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function OrderStatusUpdate({ currentStatus, onUpdate, loading }) {
  const [status, setStatus] = useState(currentStatus);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingUrl, setTrackingUrl] = useState('');
  const [note, setNote] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({ status, trackingNumber: trackingNumber || undefined, trackingUrl: trackingUrl || undefined, note: note || undefined });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Update Order Status</h3>
      <div>
        <label>Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      {status === 'shipped' && (
        <>
          <div>
            <label>Tracking Number</label>
            <input value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} />
          </div>
          <div>
            <label>Tracking URL</label>
            <input value={trackingUrl} onChange={(e) => setTrackingUrl(e.target.value)} />
          </div>
        </>
      )}
      <div>
        <label>Note</label>
        <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Optional note" />
      </div>
      <button type="submit" disabled={loading}>{loading ? 'Updating...' : 'Update Status'}</button>
    </form>
  );
}