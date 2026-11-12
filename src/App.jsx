import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { AnimeProvider } from './context/AnimeContext';
import { FavoritesProvider } from './context/FavoritesContext';
import AnimeDetails from './pages/AnimeDetails';
import Discover from './pages/Discover';
import Favorites from './pages/Favorites';
import Home from './pages/Home';
import './styles/global.css';
import './styles/navbar.css';
import './styles/home.css';
import './styles/discover.css';
import './styles/anime-details.css';
import './styles/favorites.css';

function App() {
  return (
    <AnimeProvider>
      <FavoritesProvider>
        <BrowserRouter>
          <div className="app-shell">
            <Navbar />
            <main className="page-body">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/discover" element={<Discover />} />
                <Route path="/anime/:id" element={<AnimeDetails />} />
                <Route path="/favorites" element={<Favorites />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </FavoritesProvider>
    </AnimeProvider>
  );
}

export default App;
