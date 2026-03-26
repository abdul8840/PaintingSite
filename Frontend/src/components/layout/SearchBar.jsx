import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiSearch, HiX } from 'react-icons/hi';

export default function SearchBar({ onClose }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <HiSearch />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search artworks..."
          autoFocus
        />
        <button type="button" onClick={onClose}><HiX /></button>
      </form>
    </div>
  );
}