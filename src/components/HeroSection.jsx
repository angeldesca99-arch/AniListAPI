import { ArrowRight, PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HeroSection({ anime }) {
  if (!anime) {
    return null;
  }

  const title = anime.title?.english || anime.title?.romaji || 'Anime';
  const backgroundImage = anime.bannerImage || anime.coverImage;

  return (
    <section
      className="hero-section"
      style={{
        backgroundImage: `linear-gradient(90deg, rgba(12, 16, 29, 0.95), rgba(12, 16, 29, 0.3)), url(${backgroundImage})`,
      }}
    >
      <div className="container hero-content">
        <div className="hero-copy">
          <span className="eyebrow">Featured tonight</span>
          <h1>{title}</h1>
          <p>{anime.description || 'Explore a popular title with rich story arcs, standout characters, and beloved scores.'}</p>
          <div className="hero-actions">
            <Link to={`/anime/${anime.id}`} className="primary-button">
              <PlayCircle size={18} />
              Explore Anime
            </Link>
            <Link to="/discover" className="secondary-button">
              Browse catalog
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
