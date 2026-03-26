import { HiSearch, HiX } from 'react-icons/hi';

export default function SearchInput({ 
  value, 
  onChange, 
  placeholder = 'Search...',
  className = '' 
}) {
  return (
    <div className={`relative w-full sm:w-auto ${className}`}>
      <div className="
        absolute left-3 top-1/2 -translate-y-1/2
        pointer-events-none
      ">
        <HiSearch className="w-5 h-5 text-text-muted" />
      </div>
      
      <input 
        type="text" 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        placeholder={placeholder}
        className="
          w-full sm:w-64 lg:w-80
          pl-10 pr-10 py-2.5
          text-sm
          text-text-primary
          placeholder:text-text-muted
          bg-bg-primary
          border border-border-light
          rounded-lg
          transition-all duration-200
          hover:border-border-medium
          focus:outline-none focus:border-theme-secondary focus:ring-2 focus:ring-theme-secondary/20
        "
      />
      
      {value && (
        <button
          onClick={() => onChange('')}
          className="
            absolute right-3 top-1/2 -translate-y-1/2
            p-1
            text-text-muted hover:text-text-primary
            rounded
            transition-colors duration-200
            cursor-pointer
          "
        >
          <HiX className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}