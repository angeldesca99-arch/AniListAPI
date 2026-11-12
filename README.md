# AniVerse – Anime Discovery & Watchlist Platform

AniVerse is a responsive React single-page application built with Vite that uses the public Kitsu REST API to help users discover anime, browse by genre and format, view detailed information, and save favorites in LocalStorage.

## Features

- Anime discovery home page with multiple API-driven sections
- Search and filter experience for anime titles, genres, format, and status
- Detailed anime page with banner, cover, stats, and characters
- Favorites management with persistent LocalStorage storage
- Responsive dark-themed design inspired by modern anime streaming apps
- React Router navigation across four core pages

## Technology Stack

- React.js
- Vite
- React Router DOM
- Lucide React
- Kitsu REST API
- JavaScript (ES6+)
- LocalStorage

## Kitsu REST API

API documentation: https://kitsu.docs.apiary.io/

API endpoint: https://kitsu.io/api/edge

This project uses public, unauthenticated REST requests to retrieve live anime data.

## Public Repository

https://github.com/angeldesca99-arch/AniListAPI

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Production Build

```bash
npm run build
```

## Project Structure

```text
src/
  components/
    AnimeCard.jsx
    AnimeGrid.jsx
    EmptyState.jsx
    ErrorMessage.jsx
    FavoriteButton.jsx
    Footer.jsx
    GenreFilter.jsx
    HeroSection.jsx
    LoadingSpinner.jsx
    Navbar.jsx
    Pagination.jsx
    SearchBar.jsx
    SortDropdown.jsx
  context/
    AnimeContext.jsx
    FavoritesContext.jsx
  hooks/
    useDebounce.js
  pages/
    AnimeDetails.jsx
    Discover.jsx
    Favorites.jsx
    Home.jsx
  services/
    animeApi.js
  styles/
    anime-details.css
    discover.css
    favorites.css
    global.css
    home.css
    navbar.css
  App.jsx
  main.jsx
```

## Application Routes

- `/` – Landing page with featured and trending anime
- `/discover` – Search, filters, sorting, and pagination
- `/anime/:id` – Detailed page for each anime
- `/favorites` – Saved watchlist stored in LocalStorage

## API Integration Notes

The application uses reusable REST request helpers in `src/services/animeApi.js` and sends GET requests to Kitsu. Data is normalized before being displayed in the UI so the app can consistently render title, image, description, genres, score, popularity, episode count, and duration.

## LocalStorage Notes

The favorites system persists anime IDs and payloads using browser LocalStorage. This allows users to keep their watchlist across refreshes without authentication or a backend database.

## GitHub Workflow

### Branch Strategy

Suggested branches for a two-person team:

- `main`
- `feature/homepage`
- `feature/api-integration`
- `feature/discover-search`
- `feature/anime-details`
- `feature/favorites`
- `feature/responsive-design`
- `docs/readme`

### Basic Git Commands

```bash
git checkout main
git pull origin main
git checkout -b feature/api-integration
git add .
git commit -m "feat: integrate Kitsu REST API"
git push origin feature/api-integration
```

### Pull Request Workflow

1. Create a feature branch from main.
2. Make focused commits with conventional commit messages.
3. Push the branch to GitHub.
4. Open a Pull Request into main.
5. Review, request updates if needed, and merge after approval.

## Team Contribution Breakdown

- Team Member 1: homepage, navigation, responsive UI, and visual polish
- Team Member 2: Kitsu REST API integration, search/filter logic, and favorites persistence
- Shared: review, testing, bug fixing, and deployment preparation

## Notes

- Requests use the public Kitsu REST API and are designed to avoid unnecessary repeated calls.
- Loading, empty, and error states are included to prevent blank screens when a request fails.
- The app is suitable for presentation and demonstration as a Web Systems and Technologies final project.
