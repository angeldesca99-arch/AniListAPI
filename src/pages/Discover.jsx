import { useEffect, useState } from 'react';
import AnimeGrid from '../components/AnimeGrid';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';
import GenreFilter from '../components/GenreFilter';
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/Pagination';
import SearchBar from '../components/SearchBar';
import SortDropdown from '../components/SortDropdown';
import { useAnimeContext } from '../context/AnimeContext';
import { useDebounce } from '../hooks/useDebounce';
import { fetchDiscoverAnime } from '../services/animeApi';

const formatOptions = ['TV', 'MOVIE', 'OVA', 'ONA', 'SPECIAL'];
const statusOptions = [
  { value: 'RELEASING', label: 'Currently airing' },
  { value: 'FINISHED', label: 'Finished' },
  { value: 'NOT_YET_RELEASED', label: 'Upcoming' },
];

export default function Discover() {
  const {
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
  } = useAnimeContext();

  const [animeList, setAnimeList] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [pageInfo, setPageInfo] = useState({ total: 0, currentPage: 1, lastPage: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryKey, setRetryKey] = useState(0);

  const debouncedSearch = useDebounce(searchQuery, 400);

  useEffect(() => {
    let active = true;

    const loadAnime = async () => {
      try {
        setLoading(true);
        setError('');

        const data = await fetchDiscoverAnime({
          search: debouncedSearch,
          genre: selectedGenre,
          format: selectedFormat,
          status: selectedStatus,
          sort: sortBy,
          page: currentPage,
          perPage: 12,
        });

        if (!active) {
          return;
        }

        setAnimeList(data.media);
        setPageInfo(data.pageInfo);
        setTotalResults(data.pageInfo.total || 0);
      } catch (loadError) {
        if (active) {
          setError(loadError.message || 'Unable to load anime results.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadAnime();

    return () => {
      active = false;
    };
  }, [debouncedSearch, selectedGenre, selectedFormat, selectedStatus, sortBy, currentPage, retryKey]);

  const handlePageChange = (nextPage) => {
    setCurrentPage(nextPage);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedGenre('');
    setSelectedFormat('');
    setSelectedStatus('');
    setSortBy('POPULARITY_DESC');
    setCurrentPage(1);
  };

  return (
    <div className="discover-page container">
      <section className="discover-header">
        <div>
          <span className="eyebrow">Anime library</span>
          <h1>Discover anime</h1>
          <p>Find your next favorite from the Kitsu catalog.</p>
        </div>
        <div className="results-summary">
          <strong>{totalResults.toLocaleString()}</strong>
          <span>titles found</span>
        </div>
      </section>

      <section className="filter-panel" aria-label="Search and filter anime">
        <div className="filter-toolbar">
          <span className="filter-kicker">Refine your search</span>
          {(searchQuery || selectedGenre || selectedFormat || selectedStatus || sortBy !== 'POPULARITY_DESC') && (
            <button type="button" className="secondary-button inline-button" onClick={clearFilters}>
              Clear filters
            </button>
          )}
        </div>

        <SearchBar
          value={searchQuery}
          onChange={(value) => {
            setCurrentPage(1);
            setSearchQuery(value);
          }}
          onSearch={() => setCurrentPage(1)}
        />

        <div className="filters-bar">
          <GenreFilter value={selectedGenre} onChange={(value) => {
            setCurrentPage(1);
            setSelectedGenre(value);
          }} />

          <label className="filter-field">
            <span>Format</span>
            <select value={selectedFormat} onChange={(event) => {
              setCurrentPage(1);
              setSelectedFormat(event.target.value);
            }}>
              <option value="">All formats</option>
              {formatOptions.map((format) => (
                <option key={format} value={format}>{format}</option>
              ))}
            </select>
          </label>

          <label className="filter-field">
            <span>Status</span>
            <select value={selectedStatus} onChange={(event) => {
              setCurrentPage(1);
              setSelectedStatus(event.target.value);
            }}>
              <option value="">Any status</option>
              {statusOptions.map((status) => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </label>

          <SortDropdown
            value={sortBy}
            onChange={(value) => {
              setCurrentPage(1);
              setSortBy(value);
            }}
          />
        </div>
      </section>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} onRetry={() => setRetryKey((value) => value + 1)} />
      ) : animeList.length === 0 ? (
        <EmptyState
          title="No anime found"
          message="Try adjusting your search or filters to find more results."
          action={<button type="button" onClick={clearFilters} className="primary-button">Reset filters</button>}
        />
      ) : (
        <>
          <AnimeGrid items={animeList} />
          <Pagination
            currentPage={currentPage}
            totalPages={pageInfo.lastPage || 1}
            onPageChange={handlePageChange}
            disabled={loading}
          />
        </>
      )}
    </div>
  );
}
