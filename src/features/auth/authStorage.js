const STORAGE_KEY = 'shopease.auth';

// Loads a persisted session on app boot, honoring the same 300s expiry the
// backend enforces — an expired accessToken is dropped rather than restored,
// since silent refresh isn't in scope yet (see auth API contract notes).
export function loadPersistedAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const saved = JSON.parse(raw);
    if (!saved.accessToken || !saved.expiresAt || saved.expiresAt <= Date.now()) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return saved;
  } catch {
    return null;
  }
}

export function persistAuth(authState) {
  try {
    if (authState.accessToken) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authState));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // localStorage unavailable (private browsing, quota) — session just
    // won't survive a refresh; nothing else to do about it here.
  }
}
