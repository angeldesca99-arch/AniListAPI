export default function GenreFilter({ value, onChange }) {
  const genres = ['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Romance', 'Sci-Fi', 'Thriller', 'Mystery', 'Slice of Life'];

  return (
    <label className="filter-field">
      <span>Genre</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">All genres</option>
        {genres.map((genre) => (
          <option key={genre} value={genre}>
            {genre}
          </option>
        ))}
      </select>
    </label>
  );
}
