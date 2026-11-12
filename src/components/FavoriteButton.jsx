import { Heart } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';

export default function FavoriteButton({ anime, compact = false }) {
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const saved = isFavorite(anime.id);

  const handleToggle = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (saved) {
      removeFavorite(anime.id);
      return;
    }

    addFavorite(anime);
  };

  return (
    <button
      type="button"
      className={`favorite-button ${saved ? 'active' : ''} ${compact ? 'compact' : ''}`}
      onClick={handleToggle}
      aria-label={saved ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart size={16} fill={saved ? 'currentColor' : 'none'} />
      <span>{saved ? 'Saved' : 'Save'}</span>
    </button>
  );
}
