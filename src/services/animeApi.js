const API_URL = 'https://kitsu.io/api/edge';

const GENRE_SLUGS = {
  Action: 'action',
  Adventure: 'adventure',
  Comedy: 'comedy',
  Drama: 'drama',
  Fantasy: 'fantasy',
  Romance: 'romance',
  'Sci-Fi': 'sci-fi',
  Thriller: 'thriller',
  Mystery: 'mystery',
  'Slice of Life': 'slice-of-life',
};

const SORT_OPTIONS = {
  POPULARITY_DESC: '-userCount',
  SCORE_DESC: '-averageRating',
  START_DATE_DESC: '-startDate',
  TITLE_ROMAJI: 'canonicalTitle',
};

const STATUS_OPTIONS = {
  RELEASING: 'current',
  FINISHED: 'finished',
  NOT_YET_RELEASED: 'upcoming',
};

function parseDate(date) {
  if (!date) {
    return null;
  }

  const [year, month, day] = date.split('-').map(Number);
  return { year, month, day };
}

function getSeason(date) {
  const parsedDate = parseDate(date);

  if (!parsedDate) {
    return 'UNKNOWN';
  }

  if ([12, 1, 2].includes(parsedDate.month)) {
    return 'WINTER';
  }

  if ([3, 4, 5].includes(parsedDate.month)) {
    return 'SPRING';
  }

  if ([6, 7, 8].includes(parsedDate.month)) {
    return 'SUMMER';
  }

  return 'FALL';
}

function getCurrentSeason() {
  const month = new Date().getMonth() + 1;

  if ([12, 1, 2].includes(month)) {
    return 'winter';
  }

  if ([3, 4, 5].includes(month)) {
    return 'spring';
  }

  if ([6, 7, 8].includes(month)) {
    return 'summer';
  }

  return 'fall';
}

function normalizeAnime(record, included = []) {
  const attributes = record.attributes || {};
  const includedGenres = new Map(
    included
      .filter((item) => item.type === 'genres')
      .map((item) => [item.id, item.attributes.name]),
  );
  const genreReferences = record.relationships?.genres?.data || [];
  const primaryTitle =
    attributes.titles?.en ||
    attributes.titles?.en_us ||
    attributes.canonicalTitle ||
    'Unknown title';
  const startDate = parseDate(attributes.startDate);

  return {
    id: Number(record.id),
    title: {
      english: primaryTitle,
      romaji: attributes.titles?.en_jp || attributes.canonicalTitle || primaryTitle,
      native: attributes.titles?.ja_jp || attributes.titles?.en_jp || primaryTitle,
    },
    coverImage:
      attributes.posterImage?.large ||
      attributes.posterImage?.original ||
      attributes.posterImage?.medium ||
      '',
    bannerImage:
      attributes.coverImage?.large ||
      attributes.coverImage?.original ||
      attributes.posterImage?.large ||
      '',
    description: attributes.synopsis || attributes.description || 'No description available.',
    genres: genreReferences
      .map((genre) => includedGenres.get(genre.id))
      .filter(Boolean),
    averageScore: Math.round(Number(attributes.averageRating) || 0),
    popularity: Number(attributes.userCount || attributes.popularityRank) || 0,
    episodes: attributes.episodeCount || 0,
    duration: attributes.episodeLength || 0,
    season: getSeason(attributes.startDate),
    seasonYear: startDate?.year || null,
    status:
      attributes.status === 'current'
        ? 'RELEASING'
        : attributes.status === 'finished'
          ? 'FINISHED'
          : attributes.status === 'upcoming'
            ? 'NOT_YET_RELEASED'
            : attributes.status || 'UNKNOWN',
    format: (attributes.subtype || attributes.showType || 'UNKNOWN').toUpperCase(),
    startDate,
    endDate: parseDate(attributes.endDate),
    studios: [],
    characters: [],
    siteUrl: attributes.slug ? `https://kitsu.io/anime/${attributes.slug}` : '',
  };
}

async function fetchKitsu(path, params = new URLSearchParams()) {
  const query = params.toString();
  const response = await fetch(`${API_URL}/${path}${query ? `?${query}` : ''}`, {
    headers: { Accept: 'application/vnd.api+json' },
  });

  if (response.status === 429) {
    throw new Error('Kitsu is rate-limiting requests. Please wait a moment and try again.');
  }

  if (!response.ok) {
    throw new Error(`Anime request failed with status ${response.status}.`);
  }

  const result = await response.json();

  if (result.errors?.length) {
    throw new Error(result.errors[0].detail || 'Kitsu could not complete the anime request.');
  }

  return result;
}

async function fetchAnimeList(params) {
  params.set('include', 'genres');
  const result = await fetchKitsu('anime', params);
  return result.data.map((record) => normalizeAnime(record, result.included || []));
}

function createHomeParams(limit, sort) {
  const params = new URLSearchParams({
    'page[limit]': String(limit),
    sort,
  });

  return params;
}

export async function fetchTrendingAnime(limit = 8) {
  const params = createHomeParams(limit, '-userCount');
  params.set('filter[status]', 'current');
  return fetchAnimeList(params);
}

export async function fetchPopularAnime(limit = 8) {
  return fetchAnimeList(createHomeParams(limit, '-userCount'));
}

export async function fetchTopRatedAnime(limit = 8) {
  return fetchAnimeList(createHomeParams(limit, '-averageRating'));
}

export async function fetchSeasonalAnime(limit = 8) {
  const currentDate = new Date();
  const params = createHomeParams(limit, '-userCount');
  params.set('filter[season]', getCurrentSeason());
  params.set('filter[seasonYear]', String(currentDate.getFullYear()));
  return fetchAnimeList(params);
}

export async function fetchDiscoverAnime({
  search = '',
  genre = '',
  format = '',
  status = '',
  sort = 'POPULARITY_DESC',
  page = 1,
  perPage = 12,
}) {
  const params = new URLSearchParams({
    'page[limit]': String(perPage),
    'page[offset]': String((page - 1) * perPage),
    sort: SORT_OPTIONS[sort] || SORT_OPTIONS.POPULARITY_DESC,
  });

  if (search.trim()) {
    params.set('filter[text]', search.trim());
  }

  if (genre) {
    params.set('filter[genres]', GENRE_SLUGS[genre] || genre.toLowerCase());
  }

  if (format) {
    params.set('filter[subtype]', format.toLowerCase());
  }

  if (STATUS_OPTIONS[status]) {
    params.set('filter[status]', STATUS_OPTIONS[status]);
  }

  params.set('include', 'genres');

  const result = await fetchKitsu('anime', params);
  const total = result.meta?.count || 0;
  const lastPage = Math.max(1, Math.ceil(total / perPage));

  return {
    pageInfo: {
      total,
      currentPage: page,
      hasNextPage: page < lastPage,
      lastPage,
    },
    media: result.data.map((record) => normalizeAnime(record, result.included || [])),
  };
}

export async function fetchAnimeById(id) {
  const params = new URLSearchParams({ include: 'genres' });
  const result = await fetchKitsu(`anime/${encodeURIComponent(id)}`, params);

  if (!result.data) {
    throw new Error('This anime could not be found.');
  }

  return normalizeAnime(result.data, result.included || []);
}
