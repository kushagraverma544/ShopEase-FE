import { beforeEach, describe, expect, it } from 'vitest';

import { loadPersistedAuth, persistAuth } from './authStorage';

describe('authStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns null when nothing has been persisted', () => {
    expect(loadPersistedAuth()).toBeNull();
  });

  it('round-trips a still-valid session across a "refresh"', () => {
    const session = {
      user: { username: 'test1' },
      accessToken: 'abc123',
      refreshToken: 'refresh-456',
      expiresAt: Date.now() + 300_000,
    };

    persistAuth(session);

    expect(loadPersistedAuth()).toEqual(session);
  });

  it('drops an expired session instead of restoring it', () => {
    persistAuth({
      user: { username: 'test1' },
      accessToken: 'abc123',
      refreshToken: 'refresh-456',
      expiresAt: Date.now() - 1000,
    });

    expect(loadPersistedAuth()).toBeNull();
    expect(localStorage.getItem('shopease.auth')).toBeNull();
  });

  it('clears storage once the session is logged out (no accessToken)', () => {
    persistAuth({
      user: { username: 'test1' },
      accessToken: 'abc123',
      refreshToken: 'refresh-456',
      expiresAt: Date.now() + 300_000,
    });

    persistAuth({ user: null, accessToken: null, refreshToken: null, expiresAt: null });

    expect(loadPersistedAuth()).toBeNull();
  });
});
