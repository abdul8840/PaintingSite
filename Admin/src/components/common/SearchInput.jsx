import { HiSearch } from 'react-icons/hi';

export default function SearchInput({ value, onChange, placeholder = 'Search...' }) {
  return (
    <div>
      <HiSearch />
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}