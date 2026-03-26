import { useState } from 'react';
import { HiLocationMarker, HiChevronDown } from 'react-icons/hi';

export default function AddressForm({ address, onSubmit, onCancel }) {
  const [form, setForm] = useState(
    address || {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US',
    }
  );

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  const InputField = ({ label, name, type = 'text', required = true }) => (
    <div>
      <label
        htmlFor={name}
        className="
          block text-xs font-semibold uppercase tracking-wider
          text-charcoal mb-2
        "
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={form[name]}
        onChange={handleChange}
        required={required}
        className="
          w-full px-4 py-2.5 rounded-xl
          bg-cream/50 border border-cream
          text-sm text-ink
          placeholder:text-mist
          focus:outline-none focus:border-rust/40
          focus:shadow-md focus:shadow-rust/5
          transition-all duration-300
        "
      />
    </div>
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="
        bg-paper rounded-2xl
        border border-cream
        p-5 sm:p-6 lg:p-8
        space-y-5
        animate-fade-in-up
      "
      style={{ animationFillMode: 'forwards' }}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 pb-4 border-b border-cream">
        <div
          className="
            w-9 h-9 rounded-xl
            bg-rust/10
            flex items-center justify-center
          "
        >
          <HiLocationMarker className="w-4.5 h-4.5 text-rust" />
        </div>
        <div>
          <h3 className="text-base font-bold text-ink">Shipping Address</h3>
          <p className="text-xs text-mist mt-0.5">
            Where should we deliver your artwork?
          </p>
        </div>
      </div>

      {/* Street */}
      <InputField label="Street Address" name="street" />

      {/* City + State */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField label="City" name="city" />
        <InputField label="State / Province" name="state" />
      </div>

      {/* ZIP + Country */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField label="ZIP / Postal Code" name="zipCode" />

        {/* Country Select */}
        <div>
          <label
            htmlFor="country"
            className="
              block text-xs font-semibold uppercase tracking-wider
              text-charcoal mb-2
            "
          >
            Country
          </label>
          <div className="relative">
            <select
              id="country"
              name="country"
              value={form.country}
              onChange={handleChange}
              className="
                w-full appearance-none
                px-4 py-2.5 pr-10 rounded-xl
                bg-cream/50 border border-cream
                text-sm text-ink
                focus:outline-none focus:border-rust/40
                focus:shadow-md focus:shadow-rust/5
                transition-all duration-300 cursor-pointer
              "
            >
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="GB">United Kingdom</option>
              <option value="AU">Australia</option>
            </select>
            <HiChevronDown
              className="
                absolute right-3 top-1/2 -translate-y-1/2
                w-4 h-4 text-mist pointer-events-none
              "
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div
        className="
          flex flex-col-reverse sm:flex-row items-center gap-3
          pt-4 border-t border-cream
        "
      >
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="
              w-full sm:w-auto
              px-6 py-2.5 rounded-xl
              text-sm font-semibold text-charcoal
              bg-cream hover:bg-mist/30
              transition-all duration-300 cursor-pointer
              active:scale-[0.98]
            "
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="
            w-full sm:w-auto sm:ml-auto
            px-6 py-2.5 rounded-xl
            bg-ink text-paper text-sm font-semibold
            hover:bg-charcoal
            transition-all duration-300 cursor-pointer
            active:scale-[0.98]
            shadow-md shadow-ink/10
          "
        >
          Save Address
        </button>
      </div>
    </form>
  );
}