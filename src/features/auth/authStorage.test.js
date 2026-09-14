import { beforeEach, describe, expect, it } from 'vitest';

import { loadPersistedAuth, persistAuth } from './authStorage';

describe('authStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns null when nothing has been persisted', () => {
    expect(loadPersistedAuth()).toBeNull();
  });

  it('round-trips a session across a "refresh" — no expiry, only logout clears it', () => {
    const session = {
      user: { username: 'test1' },
      accessToken: 'abc123',
      refreshToken: 'refresh-456',
    };

    persistAuth(session);

    expect(loadPersistedAuth()).toEqual(session);
  });

  it('clears storage once the session is logged out (no accessToken)', () => {
    persistAuth({
      user: { username: 'test1' },
      accessToken: 'abc123',
      refreshToken: 'refresh-456',
    });

    persistAuth({ user: null, accessToken: null, refreshToken: null });

    expect(loadPersistedAuth()).toBeNull();
  });
});
