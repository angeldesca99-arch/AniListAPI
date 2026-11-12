import { ArrowRight, PlayCircle, Sparkles, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HeroSection({ anime }) {
  if (!anime) {
    return null;
  }

  const title = anime.title?.english || anime.title?.romaji || 'Anime';
  const backgroundImage = anime.bannerImage || anime.coverImage;
  const coverImage = anime.coverImage || backgroundImage;

  return (
    <section
      className="hero-section"
      style={{ '--hero-image': `url(${backgroundImage})` }}
      aria-labelledby="featured-anime-title"
    >
      <div className="container hero-content">
        <div className="hero-copy">
          <span className="eyebrow"><Sparkles size={14} /> Featured anime</span>
          <h1 id="featured-anime-title">{title}</h1>
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
        <div className="hero-art">
          <img src={coverImage} alt={`${title} cover art`} />
          <div className="hero-art-caption">
            <span>{anime.averageScore ? `${anime.averageScore}% community score` : 'Featured pick'}</span>
            <Star size={16} fill="currentColor" />
          </div>
        </div>
      </div>
    </section>
  );
}
