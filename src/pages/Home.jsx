import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AnimeGrid from '../components/AnimeGrid';
import ErrorMessage from '../components/ErrorMessage';
import HeroSection from '../components/HeroSection';
import LoadingSpinner from '../components/LoadingSpinner';
import SearchBar from '../components/SearchBar';
import { useAnimeContext } from '../context/AnimeContext';
import {
  fetchPopularAnime,
  fetchSeasonalAnime,
  fetchTopRatedAnime,
  fetchTrendingAnime,
} from '../services/animeApi';

export default function Home() {
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery, setCurrentPage } = useAnimeContext();
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [seasonal, setSeasonal] = useState([]);
  const [heroAnime, setHeroAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);
        setError('');

        const [trendingList, popularList, topRatedList, seasonalList] = await Promise.all([
          fetchTrendingAnime(8),
          fetchPopularAnime(8),
          fetchTopRatedAnime(8),
          fetchSeasonalAnime(8),
        ]);

        setTrending(trendingList);
        setPopular(popularList);
        setTopRated(topRatedList);
        setSeasonal(seasonalList);
        setHeroAnime(trendingList[0] || popularList[0] || topRatedList[0]);
      } catch (loadError) {
        setError(loadError.message || 'Unable to load home page anime right now.');
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="home-page">
      <HeroSection anime={heroAnime} />

      <div className="container home-content">
        <section className="search-panel">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={() => {
              setCurrentPage(1);
              navigate('/discover');
            }}
          />
        </section>

        <section className="content-section">
          <div className="section-header">
            <h2>Trending now</h2>
            <span>What viewers are watching right now</span>
          </div>
          <AnimeGrid items={trending} />
        </section>

        <section className="content-section">
          <div className="section-header">
            <h2>Popular picks</h2>
            <span>Fan-favorite anime across the community</span>
          </div>
          <AnimeGrid items={popular} />
        </section>

        <section className="content-section">
          <div className="section-header">
            <h2>Highest rated</h2>
            <span>Critically acclaimed and top-scoring stories</span>
          </div>
          <AnimeGrid items={topRated} />
        </section>

        <section className="content-section">
          <div className="section-header">
            <h2>Seasonal spotlight</h2>
            <span>Fresh themes and seasonal favorites</span>
          </div>
          <AnimeGrid items={seasonal} />
        </section>
      </div>
    </div>
  );
}
