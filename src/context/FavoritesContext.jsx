import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const FavoritesContext = createContext(null);
const STORAGE_KEY = 'aniverse-favorites';

function readFavorites() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(readFavorites);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (anime) => {
    setFavorites((current) => {
      if (current.some((item) => item.id === anime.id)) {
        return current;
      }

      return [anime, ...current];
    });
  };

  const removeFavorite = (animeId) => {
    setFavorites((current) => current.filter((item) => item.id !== animeId));
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  const isFavorite = (animeId) => favorites.some((item) => item.id === animeId);

  const value = useMemo(
    () => ({
      favorites,
      addFavorite,
      removeFavorite,
      clearFavorites,
      isFavorite,
    }),
    [favorites],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error('useFavorites must be used inside FavoritesProvider');
  }

  return context;
}
