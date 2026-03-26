import { HiCheck } from 'react-icons/hi';

export default function OrderTimeline({ statusHistory = [] }) {
  return (
    <div>
      <h3>Order Timeline</h3>
      <div>
        {statusHistory.map((entry, index) => (
          <div key={index}>
            <div><HiCheck /></div>
            <div>
              <p>{entry.status}</p>
              {entry.note && <p>{entry.note}</p>}
              <p>{new Date(entry.date).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}