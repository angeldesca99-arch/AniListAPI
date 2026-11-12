import { createContext, useContext, useMemo, useState } from 'react';

const AnimeContext = createContext(null);

export function AnimeProvider({ children }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [sortBy, setSortBy] = useState('POPULARITY_DESC');
  const [currentPage, setCurrentPage] = useState(1);

  const value = useMemo(
    () => ({
      searchQuery,
      setSearchQuery,
      selectedGenre,
      setSelectedGenre,
      selectedFormat,
      setSelectedFormat,
      selectedStatus,
      setSelectedStatus,
      sortBy,
      setSortBy,
      currentPage,
      setCurrentPage,
    }),
    [searchQuery, selectedGenre, selectedFormat, selectedStatus, sortBy, currentPage],
  );

  return <AnimeContext.Provider value={value}>{children}</AnimeContext.Provider>;
}

export function useAnimeContext() {
  const context = useContext(AnimeContext);

  if (!context) {
    throw new Error('useAnimeContext must be used within AnimeProvider');
  }

  return context;
}
