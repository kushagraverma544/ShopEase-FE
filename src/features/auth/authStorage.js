const STORAGE_KEY = 'shopease.auth';

// Loads a persisted session on app boot. No expiry check here — the app
// only logs a user out when they click Logout, not on its own. A stale
// accessToken just means the next protected API call 401s; that's handled
// wherever that call happens, not by clearing the session on load.
export function loadPersistedAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const saved = JSON.parse(raw);
    if (!saved.accessToken) {
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
