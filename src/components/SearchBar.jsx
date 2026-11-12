import { Search } from 'lucide-react';

export default function SearchBar({ value, onChange, onSearch, placeholder = 'Search anime...' }) {
  return (
    <div className="search-bar">
      <Search size={18} />
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label="Search anime"
        onKeyDown={(event) => {
          if (event.key === 'Enter' && onSearch) {
            onSearch();
          }
        }}
      />
      {onSearch ? (
        <button type="button" onClick={onSearch} className="primary-button">
          Search
        </button>
      ) : null}
    </div>
  );
}
