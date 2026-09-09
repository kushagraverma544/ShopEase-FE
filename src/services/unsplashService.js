import { unsplashClient } from './api/unsplashClient';

const CACHE_KEY_PREFIX = 'unsplash-photo:';
const TOP_RESULTS_POOL_SIZE = 5;

// Unsplash's free tier is rate-limited (50 req/hour), and this photo is only
// decorative background art, so cache each query's result for the browser
// session — a refresh during development shouldn't burn through the quota.
function readCache(query) {
  try {
    const cached = sessionStorage.getItem(CACHE_KEY_PREFIX + query);
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
}

function writeCache(query, photo) {
  try {
    sessionStorage.setItem(CACHE_KEY_PREFIX + query, JSON.stringify(photo));
  } catch {
    // sessionStorage unavailable (private mode, quota) — safe to skip caching
  }
}

// `/photos/random` returns a genuinely random photo for the query, which can
// be an oddly-cropped or low-quality match. `/search/photos` ranks results
// by relevance, so picking from its top handful gives noticeably better,
// more on-topic photos while still varying which one shows up.
export async function getRandomPhoto(query) {
  const cached = readCache(query);
  if (cached) return cached;

  const { results } = await unsplashClient.get('/search/photos', {
    params: { query, orientation: 'landscape', per_page: TOP_RESULTS_POOL_SIZE },
  });

  if (!results?.length) {
    throw new Error(`No Unsplash results for query "${query}"`);
  }

  const photo = results[Math.floor(Math.random() * results.length)];
  writeCache(query, photo);
  return photo;
}
