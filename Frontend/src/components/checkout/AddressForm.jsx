// AddressForm.jsx
import { useState } from 'react';
import { HiLocationMarker, HiOfficeBuilding, HiMap, HiHashtag, HiGlobe, HiCheck, HiX } from 'react-icons/hi';

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
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Clear error on change
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleBlur = (e) => {
    setTouched({ ...touched, [e.target.name]: true });
    validateField(e.target.name, e.target.value);
  };

  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'street':
        if (!value.trim()) error = 'Street address is required';
        else if (value.length < 10) error = 'Please enter a complete address';
        break;
      case 'city':
        if (!value.trim()) error = 'City is required';
        break;
      case 'state':
        if (!value) error = 'Please select a state';
        break;
      case 'zipCode':
        if (!value) error = 'PIN code is required';
        else if (!/^[0-9]{6}$/.test(value)) error = 'Enter a valid 6-digit PIN';
        break;
      default:
        break;
    }
    
    setErrors(prev => ({ ...prev, [name]: error }));
    return !error;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields
    const fields = ['street', 'city', 'state', 'zipCode'];
    let isValid = true;
    
    fields.forEach(field => {
      if (!validateField(field, form[field])) {
        isValid = false;
      }
    });
    
    setTouched({
      street: true,
      city: true,
      state: true,
      zipCode: true,
    });
    
    if (isValid) {
      onSubmit(form);
    }
  };

  const inputClasses = (fieldName) => `
    w-full px-4 py-3.5 pl-12 bg-cream/30 border-2 rounded-xl text-ink font-medium 
    placeholder:text-charcoal/40 transition-all duration-300
    focus:outline-none focus:bg-white
    ${errors[fieldName] && touched[fieldName]
      ? 'border-rust focus:border-rust'
      : 'border-cream focus:border-sage'
    }
  `;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Street Address */}
      <div className="animate-fade-in-up">
        <label className="block text-sm font-semibold text-ink mb-2">
          Street Address / House No.
          <span className="text-rust ml-1">*</span>
        </label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <HiLocationMarker className={`w-5 h-5 transition-colors ${
              errors.street && touched.street ? 'text-rust' : 'text-charcoal/40'
            }`} />
          </div>
          <input
            name="street"
            value={form.street}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            placeholder="123, ABC Colony, Near XYZ Landmark"
            className={inputClasses('street')}
          />
          {errors.street && touched.street && (
            <p className="flex items-center gap-1 mt-1.5 text-sm text-rust animate-fade-in">
              <HiX className="w-4 h-4" />
              {errors.street}
            </p>
          )}
        </div>
      </div>

      {/* City & State */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in-up stagger-1">
        {/* City */}
        <div>
          <label className="block text-sm font-semibold text-ink mb-2">
            City
            <span className="text-rust ml-1">*</span>
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <HiOfficeBuilding className={`w-5 h-5 transition-colors ${
                errors.city && touched.city ? 'text-rust' : 'text-charcoal/40'
              }`} />
            </div>
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              placeholder="Mumbai"
              className={inputClasses('city')}
            />
            {errors.city && touched.city && (
              <p className="flex items-center gap-1 mt-1.5 text-sm text-rust animate-fade-in">
                <HiX className="w-4 h-4" />
                {errors.city}
              </p>
            )}
          </div>
        </div>

        {/* State */}
        <div>
          <label className="block text-sm font-semibold text-ink mb-2">
            State
            <span className="text-rust ml-1">*</span>
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <HiMap className={`w-5 h-5 transition-colors ${
                errors.state && touched.state ? 'text-rust' : 'text-charcoal/40'
              }`} />
            </div>
            <select
              name="state"
              value={form.state}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className={`${inputClasses('state')} cursor-pointer appearance-none pr-10`}
            >
              <option value="">Select State</option>
              {INDIAN_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {/* Dropdown Arrow */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-5 h-5 text-charcoal/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            {errors.state && touched.state && (
              <p className="flex items-center gap-1 mt-1.5 text-sm text-rust animate-fade-in">
                <HiX className="w-4 h-4" />
                {errors.state}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* PIN Code & Country */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in-up stagger-2">
        {/* PIN Code */}
        <div>
          <label className="block text-sm font-semibold text-ink mb-2">
            PIN Code
            <span className="text-rust ml-1">*</span>
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <HiHashtag className={`w-5 h-5 transition-colors ${
                errors.zipCode && touched.zipCode ? 'text-rust' : 'text-charcoal/40'
              }`} />
            </div>
            <input
              name="zipCode"
              value={form.zipCode}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              placeholder="400001"
              maxLength={6}
              pattern="[0-9]{6}"
              inputMode="numeric"
              className={inputClasses('zipCode')}
            />
            {errors.zipCode && touched.zipCode && (
              <p className="flex items-center gap-1 mt-1.5 text-sm text-rust animate-fade-in">
                <HiX className="w-4 h-4" />
                {errors.zipCode}
              </p>
            )}
          </div>
        </div>

        {/* Country */}
        <div>
          <label className="block text-sm font-semibold text-ink mb-2">
            Country
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <HiGlobe className="w-5 h-5 text-charcoal/40" />
            </div>
            <select
              name="country"
              value={form.country}
              onChange={handleChange}
              className={`${inputClasses('country')} cursor-pointer appearance-none pr-10`}
            >
              <option value="IN">🇮🇳 India</option>
            </select>
            {/* Dropdown Arrow */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-5 h-5 text-charcoal/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 animate-fade-in-up stagger-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 sm:flex-none px-6 py-3.5 border-2 border-cream text-charcoal hover:border-charcoal hover:bg-charcoal hover:text-white rounded-xl font-semibold transition-all duration-300 cursor-pointer"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-ink text-white rounded-xl font-semibold hover:bg-charcoal transition-all duration-300 hover:shadow-lg hover:shadow-ink/20 cursor-pointer active:scale-[0.98]"
        >
          <HiCheck className="w-5 h-5" />
          <span>Save Address</span>
        </button>
      </div>
    </form>
  );
}