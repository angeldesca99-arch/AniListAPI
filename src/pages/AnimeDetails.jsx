import { ArrowLeft, Calendar, Clapperboard, Clock3, Star, Tv, UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ErrorMessage from '../components/ErrorMessage';
import FavoriteButton from '../components/FavoriteButton';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchAnimeById } from '../services/animeApi';

export default function AnimeDetails() {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadAnime = async () => {
      try {
        setLoading(true);
        setError('');
        const animeData = await fetchAnimeById(id);
        setAnime(animeData);
      } catch (loadError) {
        setError(loadError.message || 'Unable to fetch anime details.');
      } finally {
        setLoading(false);
      }
    };

    loadAnime();
  }, [id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;
  }

  if (!anime) {
    return null;
  }

  const title = anime.title?.english || anime.title?.romaji || 'Anime';
  const japaneseTitle = anime.title?.native || anime.title?.romaji || title;
  const bannerUrl = anime.bannerImage || anime.coverImage;

  return (
    <div className="anime-details-page">
      <div
        className="anime-detail-banner"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(7, 11, 21, 0.15), rgba(7, 11, 21, 0.95)), url(${bannerUrl})`,
        }}
      >
        <div className="container detail-banner-inner">
          <Link to="/discover" className="back-link">
            <ArrowLeft size={16} />
            Back to Discover
          </Link>
        </div>
      </div>

      <div className="container detail-layout">
        <aside className="detail-sidebar">
          <img src={anime.coverImage || anime.bannerImage} alt={title} className="detail-cover" />
          <div className="detail-actions">
            <FavoriteButton anime={anime} />
          </div>
        </aside>

        <main className="detail-content">
          <div className="detail-heading">
            <div>
              <span className="eyebrow">Anime details</span>
              <h1>{title}</h1>
              <p className="japanese-title">{japaneseTitle}</p>
            </div>

            <div className="detail-score">
              <Star size={18} fill="currentColor" />
              {anime.averageScore ? `${anime.averageScore}%` : 'NR'}
            </div>
          </div>

          <div className="detail-tags">
            {(anime.genres || []).map((genre) => (
              <span key={genre} className="genre-tag">
                {genre}
              </span>
            ))}
          </div>

          <p className="detail-description">{anime.description || 'No description available for this title.'}</p>

          <div className="info-grid">
            <div className="info-item">
              <Calendar size={16} />
              <span>{anime.startDate?.year || 'N/A'}</span>
            </div>
            <div className="info-item">
              <Tv size={16} />
              <span>{anime.format || 'Unknown'}</span>
            </div>
            <div className="info-item">
              <Clapperboard size={16} />
              <span>{anime.episodes || 0} episodes</span>
            </div>
            <div className="info-item">
              <Clock3 size={16} />
              <span>{anime.duration ? `${anime.duration} min` : 'N/A'}</span>
            </div>
            <div className="info-item">
              <UserRound size={16} />
              <span>{(anime.studios || []).join(', ') || 'Studio information unavailable'}</span>
            </div>
          </div>

          <section className="detail-section">
            <h2>Meta</h2>
            <div className="meta-table">
              <div>
                <span>Status</span>
                <strong>{anime.status || 'Unknown'}</strong>
              </div>
              <div>
                <span>Season</span>
                <strong>{anime.season ? `${anime.season} ${anime.seasonYear || ''}` : 'Unknown'}</strong>
              </div>
              <div>
                <span>Popularity</span>
                <strong>{anime.popularity || 0}</strong>
              </div>
              <div>
                <span>Average score</span>
                <strong>{anime.averageScore ? `${anime.averageScore}%` : 'N/A'}</strong>
              </div>
            </div>
          </section>

          {anime.characters && anime.characters.length > 0 ? (
            <section className="detail-section">
              <h2>Featured characters</h2>
              <div className="character-list">
                {anime.characters.map((character) => (
                  <div key={character.id} className="character-card">
                    <img src={character.image || ''} alt={character.name} />
                    <span>{character.name}</span>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </main>
      </div>
    </div>
  );
}
