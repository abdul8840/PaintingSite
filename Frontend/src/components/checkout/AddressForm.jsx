import { useState } from 'react';

export default function AddressForm({ address, onSubmit, onCancel }) {
  const [form, setForm] = useState(address || { street: '', city: '', state: '', zipCode: '', country: 'US' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Street Address</label>
        <input name="street" value={form.street} onChange={handleChange} required />
      </div>
      <div>
        <div>
          <label>City</label>
          <input name="city" value={form.city} onChange={handleChange} required />
        </div>
        <div>
          <label>State</label>
          <input name="state" value={form.state} onChange={handleChange} required />
        </div>
      </div>
      <div>
        <div>
          <label>ZIP Code</label>
          <input name="zipCode" value={form.zipCode} onChange={handleChange} required />
        </div>
        <div>
          <label>Country</label>
          <select name="country" value={form.country} onChange={handleChange}>
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="GB">United Kingdom</option>
            <option value="AU">Australia</option>
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