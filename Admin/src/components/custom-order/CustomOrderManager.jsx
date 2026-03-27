import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchArtists } from '../../store/slices/customOrderSlice';
import { HiRefresh, HiTruck, HiUser, HiAnnotation } from 'react-icons/hi';

const CUSTOM_STATUSES = [
  { value: 'pending', label: 'Pending', color: 'warning' },
  { value: 'accepted', label: 'Accepted', color: 'info' },
  { value: 'in-progress', label: 'In Progress', color: 'info' },
  { value: 'review', label: 'Under Review', color: 'warning' },
  { value: 'revision-requested', label: 'Revision Requested', color: 'warning' },
  { value: 'completed', label: 'Completed', color: 'success' },
  { value: 'shipped', label: 'Shipped', color: 'info' },
  { value: 'delivered', label: 'Delivered', color: 'success' },
  { value: 'cancelled', label: 'Cancelled', color: 'error' },
  { value: 'refunded', label: 'Refunded', color: 'error' },
];

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

  // Update local state when order prop changes
  useEffect(() => {
    if (order) {
      setStatus(order.status || 'pending');
      setAssignedArtist(order.assignedArtist?._id || '');
      setTrackingNumber(order.trackingNumber || '');
    }
  }, [order]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { status };
    
    if (note.trim()) {
      data.note = note.trim();
    }
    
    if (assignedArtist) {
      data.assignedArtist = assignedArtist;
    }
    
    if (trackingNumber && (status === 'shipped' || status === 'delivered')) {
      data.trackingNumber = trackingNumber;
    }
    
    onUpdate(data);
    
    // Clear note after submission
    setNote('');
  };

  const inputClass = `
    w-full px-4 py-2.5
    text-sm text-gray-900
    placeholder:text-gray-400
    bg-white
    border border-gray-300 rounded-lg
    transition-all duration-200
    hover:border-gray-400
    focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
  `;

  const selectClass = `
    ${inputClass}
    cursor-pointer
    appearance-none
    bg-[url('data:image/svg+xml;charset=US-ASCII,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 20 20%22 fill=%22%236b7280%22><path fill-rule=%22evenodd%22 d=%22M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z%22 clip-rule=%22evenodd%22/></svg>')]
    bg-no-repeat bg-[right_0.75rem_center] bg-[length:1.25rem_1.25rem]
  `;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
        <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
          <HiRefresh className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Manage Custom Order</h3>
          <p className="text-sm text-gray-600">Update order status and assignments</p>
        </div>
      </div>

      {/* Status */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
          <HiRefresh className="w-4 h-4 text-gray-500" />
          Order Status
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className={selectClass}
        >
          {CUSTOM_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      {/* Assign Artist */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
          <HiUser className="w-4 h-4 text-gray-500" />
          Assign Artist
        </label>
        <select
          value={assignedArtist}
          onChange={(e) => setAssignedArtist(e.target.value)}
          className={selectClass}
        >
          <option value="">Select Artist</option>
          {artists && artists.map((a) => (
            <option key={a._id} value={a._id}>
              {a.firstName} {a.lastName} {a.email ? `(${a.email})` : ''}
            </option>
          ))}
        </select>
      </div>

      {/* Tracking Number - Show for shipped/delivered */}
      {(status === 'shipped' || status === 'delivered') && (
        <div className="animate-fadeIn">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
            <HiTruck className="w-4 h-4 text-gray-500" />
            Tracking Number
          </label>
          <input
            type="text"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder="Enter tracking number"
            className={inputClass}
          />
        </div>
      )}

      {/* Note */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
          <HiAnnotation className="w-4 h-4 text-gray-500" />
          Add Note (Optional)
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          placeholder="Add a note for this update (visible in order history)..."
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="
          w-full
          px-6 py-3
          bg-gray-900 hover:bg-gray-800
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
            Update Order
          </>
        )}
      </button>
    </form>
  );
}