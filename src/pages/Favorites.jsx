import { HeartOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import AnimeGrid from '../components/AnimeGrid';
import EmptyState from '../components/EmptyState';
import { useFavorites } from '../context/FavoritesContext';

export default function Favorites() {
  const { favorites, clearFavorites } = useFavorites();

  const handleClearFavorites = () => {
    if (window.confirm('Remove all saved anime from your watchlist?')) {
      clearFavorites();
    }
  };

  return (
    <div className="favorites-page container">
      <section className="favorites-header">
        <div>
          <span className="eyebrow">Saved titles</span>
          <h1>Your watchlist</h1>
        </div>

        {favorites.length > 0 ? (
          <button type="button" className="secondary-button" onClick={handleClearFavorites}>
            Remove all favorites
          </button>
        ) : null}
      </section>

      {favorites.length === 0 ? (
        <EmptyState
          title="No favorites yet"
          message="Save anime you love to keep track of them here."
          action={
            <Link to="/discover" className="primary-button">
              <HeartOff size={16} />
              Explore anime
            </Link>
          }
        />
      ) : (
        <AnimeGrid items={favorites} />
      )}
    </div>
  );
}
