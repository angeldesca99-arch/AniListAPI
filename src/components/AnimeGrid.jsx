import AnimeCard from './AnimeCard';

export default function AnimeGrid({ items = [] }) {
  return (
    <div className="anime-grid">
      {items.map((anime) => (
        <AnimeCard key={anime.id} anime={anime} />
      ))}
    </div>
  );
}
