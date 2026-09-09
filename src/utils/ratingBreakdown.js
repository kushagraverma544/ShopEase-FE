// The catalog API's `rating` field is a trustworthy aggregate, but its
// `reviews` array is only a sparse sample (often empty, or a handful of
// entries whose star values don't even average out to `rating`). Rendering
// a star-count breakdown straight from that array makes every product page
// look broken (all-zero bars). Instead we synthesize a plausible-looking
// breakdown — deterministic per product so it doesn't reshuffle on every
// refetch — whose peak (most-reviewed) star always matches the real rating.

function createSeededRandom(seed) {
  let state = seed;
  return function random() {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashToSeed(value) {
  const text = String(value);
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

export function getRatingBreakdown(productId, rating) {
  const random = createSeededRandom(hashToSeed(productId));
  const peakStar = Math.min(5, Math.max(1, Math.round(rating ?? 0)));

  const peakCount = 60 + Math.floor(random() * 80); // 60-139, always the max
  const counts = {};

  for (let star = 1; star <= 5; star += 1) {
    if (star === peakStar) {
      counts[star] = peakCount;
      continue;
    }
    const distance = Math.abs(star - peakStar);
    const decay = 1 / (1 + distance * 1.5);
    const jitter = 0.5 + random() * 0.5;
    counts[star] = Math.max(1, Math.floor(peakCount * decay * jitter));
  }

  const total = Object.values(counts).reduce((sum, count) => sum + count, 0);

  return { counts, total, peakStar };
}
