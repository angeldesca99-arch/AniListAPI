import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import FavoriteButton from './FavoriteButton';

export default function AnimeCard({ anime }) {
  const primaryTitle = anime.title?.english || anime.title?.romaji || 'Untitled anime';

  return (
    <article className="anime-card">
      <div className="anime-card-image-wrap">
        <Link to={`/anime/${anime.id}`} className="anime-card-link">
          <img
            src={anime.coverImage || anime.bannerImage}
            alt={primaryTitle}
            className="anime-card-image"
          />
        </Link>
        <FavoriteButton anime={anime} compact />
      </div>

      <div className="anime-card-body">
        <div className="anime-meta-row">
          <span className="anime-format">{anime.format || 'TV'}</span>
          <span className="anime-score">
            <Star size={12} />
            {anime.averageScore ? `${anime.averageScore}%` : 'NR'}
          </span>
        </div>

        <Link to={`/anime/${anime.id}`} className="anime-title-link">
          <h3>{primaryTitle}</h3>
        </Link>

        <div className="anime-genres">
          {(anime.genres || []).slice(0, 3).map((genre) => (
            <span key={`${anime.id}-${genre}`} className="genre-tag">
              {genre}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
