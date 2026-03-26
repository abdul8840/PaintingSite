import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchArtists } from '../../store/slices/customOrderSlice';

const CUSTOM_STATUSES = ['pending', 'accepted', 'in-progress', 'review', 'revision-requested', 'completed', 'shipped', 'delivered', 'cancelled', 'refunded'];

export default function CustomOrderManager({ order, onUpdate, loading }) {
  const dispatch = useDispatch();
  const { artists } = useSelector((state) => state.customOrders);
  const [status, setStatus] = useState(order?.status || 'pending');
  const [assignedArtist, setAssignedArtist] = useState(order?.assignedArtist?._id || '');
  const [trackingNumber, setTrackingNumber] = useState(order?.trackingNumber || '');
  const [note, setNote] = useState('');

  useEffect(() => {
    dispatch(fetchArtists());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { status, note: note || undefined };
    if (assignedArtist) data.assignedArtist = assignedArtist;
    if (trackingNumber) data.trackingNumber = trackingNumber;
    onUpdate(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Manage Custom Order</h3>
      <div>
        <label>Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          {CUSTOM_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div>
        <label>Assign Artist</label>
        <select value={assignedArtist} onChange={(e) => setAssignedArtist(e.target.value)}>
          <option value="">Select Artist</option>
          {artists.map((a) => (
            <option key={a._id} value={a._id}>{a.firstName} {a.lastName}</option>
          ))}
        </select>
      </div>
      {(status === 'shipped' || status === 'delivered') && (
        <div>
          <label>Tracking Number</label>
          <input value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} />
        </div>
      )}
      <div>
        <label>Note</label>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder="Add a note..." />
      </div>
      <button type="submit" disabled={loading}>{loading ? 'Updating...' : 'Update Order'}</button>
    </form>
  );
}