# AniVerse

## Project overview

AniVerse is a responsive, client-side React application for discovering anime and building a personal watchlist. It uses the public Kitsu REST API to load anime titles, artwork, synopses, genres, and other available details. Users can search the catalog, filter and sort results, move through paginated results, open a detail page, and save favorites in the browser.

**Public repository:** [angeldesca99-arch/AniListAPI](https://github.com/angeldesca99-arch/AniListAPI)

> This is an unofficial student project. Kitsu is a community-maintained service; AniVerse is not affiliated with Kitsu or the anime rights holders.

The interface uses an obsidian-black foundation, subtle olive glass surfaces, and chartreuse highlights for a focused, high-contrast anime discovery experience.

## Features

- Explore a featured anime and API-powered sections for trending, popular, top-rated, and seasonal titles.
- Search anime by title from the Discover page. Search input is debounced to reduce repeated requests while typing.
- Filter results by genre, format, and release status.
- Sort by popularity, average score, newest release, or title.
- Browse results with API-backed pagination.
- Open `/anime/:id` for title artwork, synopsis, genres, score, season, release dates, format, episode count, duration, and other available metadata.
- Save or remove favorites; the watchlist persists in browser LocalStorage across refreshes.
- Use responsive Home, Discover, Anime Details, and Favorites routes.
- Access loading, error, and empty states while working with live API data.

## Final project requirements

| Requirement | How AniVerse addresses it |
| --- | --- |
| Public GitHub repository | The project is hosted at [angeldesca99-arch/AniListAPI](https://github.com/angeldesca99-arch/AniListAPI). |
| Branch and pull request workflow | Project changes are developed on feature branches and proposed to `main` through pull requests; see the [GitHub collaboration workflow](#github-collaboration-workflow). |
| Clear commit history | Use descriptive conventional commit prefixes such as `feat:`, `fix:`, `style:`, and `docs:`. |
| Reusable React components | The UI is split into functional components, including `Navbar`, `SearchBar`, `AnimeGrid`, `AnimeCard`, `GenreFilter`, `SortDropdown`, `Pagination`, `FavoriteButton`, and shared loading, error, and empty states. |
| State management | `AnimeContext` shares Discover search and filter state; `FavoritesContext` manages the watchlist and persists it in LocalStorage. |
| Public REST API and asynchronous fetching | The app fetches live data from Kitsu with the Fetch API and `async`/`await`. It handles loading and request errors; Discover search is debounced and stale results are ignored. |
| Client-side routing | React Router provides Home, Discover, Anime Details, and Favorites routes; see [Client-side routing](#client-side-routing). |
| At least three interactive features | AniVerse includes title search, genre/format/status filters, sorting, pagination, and add/remove favorites. |
| Setup and API documentation | Installation, run/build/lint commands, API endpoint examples, and environment-variable guidance are included below. |

## Technology

- React 19 and JavaScript ES modules
- React Router DOM for client-side routing
- Vite for development and production builds
- Fetch API with `async`/`await`
- Kitsu REST API (`https://kitsu.io/api/edge`)
- Lucide React icons
- Browser LocalStorage for favorites

## Getting started

### Requirements

- Node.js 20.19+ or 22.12+
- npm
- Internet access for the Kitsu API and its anime artwork

### Install and run

```bash
npm install
npm run dev
```

Vite prints the local development URL after the server starts.

### Production build

```bash
npm run build
npm run preview
```

### Lint

```bash
npm run lint
```

## Project structure

```text
src/
├── components/          # Navigation, hero, search, cards, filters, pagination, and UI states
├── context/             # Shared anime search state and persistent favorites state
├── hooks/               # Debounced search hook
├── pages/               # Home, Discover, Anime Details, and Favorites views
├── services/            # Kitsu REST requests and anime data normalization
├── styles/              # Global design system and page-specific styles
├── App.jsx              # React Router routes and shared app shell
└── main.jsx             # React application entry point
```

## Kitsu REST API

The app uses public, unauthenticated GET requests. No API key is required.

- API documentation: [Kitsu API documentation](https://kitsu.docs.apiary.io/)
- API base URL: [`https://kitsu.io/api/edge`](https://kitsu.io/api/edge)
- Anime collection: [`https://kitsu.io/api/edge/anime?page%5Blimit%5D=12&page%5Boffset%5D=0&sort=-userCount&include=genres`](https://kitsu.io/api/edge/anime?page%5Blimit%5D=12&page%5Boffset%5D=0&sort=-userCount&include=genres)
- Search by title: [`https://kitsu.io/api/edge/anime?filter%5Btext%5D=naruto&page%5Blimit%5D=12&page%5Boffset%5D=0&include=genres`](https://kitsu.io/api/edge/anime?filter%5Btext%5D=naruto&page%5Blimit%5D=12&page%5Boffset%5D=0&include=genres)
- Filter by genre: [`https://kitsu.io/api/edge/anime?filter%5Bgenres%5D=action&include=genres`](https://kitsu.io/api/edge/anime?filter%5Bgenres%5D=action&include=genres)
- Filter by format and status: [`https://kitsu.io/api/edge/anime?filter%5Bsubtype%5D=tv&filter%5Bstatus%5D=current&include=genres`](https://kitsu.io/api/edge/anime?filter%5Bsubtype%5D=tv&filter%5Bstatus%5D=current&include=genres)
- Sort by average rating: [`https://kitsu.io/api/edge/anime?sort=-averageRating&include=genres`](https://kitsu.io/api/edge/anime?sort=-averageRating&include=genres)
- Anime details: [`https://kitsu.io/api/edge/anime/1?include=genres`](https://kitsu.io/api/edge/anime/1?include=genres)

The app requests pages of anime using `page[limit]` and `page[offset]`. Search and filters use Kitsu's `filter[text]`, `filter[genres]`, `filter[subtype]`, and `filter[status]` parameters. Sorting uses Kitsu's `sort` parameter. Genre relationships are requested with `include=genres`.

Requests and response normalization are implemented in `src/services/animeApi.js`. The UI uses fields available from the API, such as title, artwork, synopsis, genre, rating, popularity, episode count, duration, season, and status. Kitsu may omit artwork or metadata for individual titles.

## Environment variables

No `.env` file or API key is needed. The public Kitsu API is configured in `src/services/animeApi.js` and does not require authentication. Do not add a secret API key to client-side code; any `VITE_` environment variable is exposed to the browser.

## Async data flow

- `src/services/animeApi.js` makes asynchronous Fetch requests, checks API responses, and normalizes Kitsu records for the UI.
- The Home page loads its featured and category lists concurrently.
- The Discover page debounces search input by 400 ms and ignores results from effects that are no longer active. Requests are not cancelled with `AbortController`.
- The Anime Details page requests a title by ID and presents loading and error states while it loads.
- Loading, error, and empty-result components are shared across pages.

## Client-side routing

React Router is configured in `src/App.jsx`:

- `/` - Home, featured anime, and discovery sections
- `/discover` - Search, genre/format/status filters, sorting, and pagination
- `/anime/:id` - Details for one anime title
- `/favorites` - The user's saved watchlist

## Local favorites

Favorites are stored in the browser under the `aniverse-favorites` LocalStorage key. They remain available after a page refresh in the same browser, but are not synced between devices or users.

## Team member contributions

- **Dominay** - Researched the public API and contributed to Kitsu integration and anime data handling.
- **Roland** - Designed the application pages and built the favorites/watchlist feature.
- **Shared work** - Responsive polish, testing, documentation, and collaboration through GitHub.

## GitHub collaboration workflow

Keep `main` as the stable branch and do project work on feature branches. Do not commit project changes directly to `main`.

1. Create a focused branch, such as `feature/api-integration` or `feature/favorites`.
2. Make small commits with descriptive conventional prefixes, such as `feat: add anime search` or `fix: handle unavailable results`.
3. Push the branch and open a Pull Request targeting `main`.
4. Ask a partner to review the PR, address feedback, then merge it.
5. Pull the updated `main` before starting the next feature.

## Data and attribution

Anime metadata and artwork are requested at runtime from the public [Kitsu API](https://kitsu.io/api/edge). Artwork is served from URLs returned by Kitsu and may be unavailable for some records. Anime characters and related properties belong to their respective rights holders. AniVerse is an educational, unofficial project.
