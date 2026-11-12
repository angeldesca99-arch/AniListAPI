import { Compass, Heart, Home, Sparkles } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/discover', label: 'Discover', icon: Compass },
  { to: '/favorites', label: 'Favorites', icon: Heart },
];

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="nav-inner container">
        <NavLink to="/" className="nav-brand" aria-label="AniVerse home">
          <Sparkles size={20} />
          <span>AniVerse</span>
        </NavLink>

        <nav className="nav-links" aria-label="Main navigation">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={16} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <span className="nav-status">Live Kitsu catalog</span>
      </div>
    </header>
  );
}
