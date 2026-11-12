export default function SortDropdown({ value, onChange }) {
  const options = [
    { value: 'POPULARITY_DESC', label: 'Popularity' },
    { value: 'SCORE_DESC', label: 'Highest rated' },
    { value: 'START_DATE_DESC', label: 'Newest releases' },
    { value: 'TITLE_ROMAJI', label: 'Alphabetical' },
  ];

  return (
    <label className="filter-field">
      <span>Sort</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
