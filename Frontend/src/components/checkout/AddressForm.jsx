import { useState } from 'react';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry',
  'Chandigarh', 'Dadra and Nagar Haveli', 'Lakshadweep',
];

export default function AddressForm({ address, onSubmit, onCancel }) {
  const [form, setForm] = useState(address || {
    street: '', city: '', state: '', zipCode: '', country: 'IN',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => { e.preventDefault(); onSubmit(form); };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Street Address / House No.</label>
        <input name="street" value={form.street} onChange={handleChange} required placeholder="123, ABC Colony, Near XYZ" />
      </div>
      <div>
        <div>
          <label>City</label>
          <input name="city" value={form.city} onChange={handleChange} required placeholder="Mumbai" />
        </div>
        <div>
          <label>State</label>
          <select name="state" value={form.state} onChange={handleChange} required>
            <option value="">Select State</option>
            {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <div>
        <div>
          <label>PIN Code</label>
          <input name="zipCode" value={form.zipCode} onChange={handleChange} required placeholder="400001" maxLength={6} pattern="[0-9]{6}" />
        </div>
        <div>
          <label>Country</label>
          <select name="country" value={form.country} onChange={handleChange}>
            <option value="IN">India</option>
          </select>
        </div>
      </div>
      <div>
        {onCancel && <button type="button" onClick={onCancel}>Cancel</button>}
        <button type="submit">Save Address</button>
      </div>
    </form>
  );
}