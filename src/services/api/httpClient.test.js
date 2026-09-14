import { describe, expect, it } from 'vitest';

import { store } from '../../app/store';
import { userLoggedIn, userLoggedOut } from '../../features/auth/authSlice';
import { attachAuthHeader } from './httpClient';

describe('attachAuthHeader', () => {
  it('leaves the Authorization header unset when there is no session', () => {
    store.dispatch(userLoggedOut());

    const config = attachAuthHeader({ headers: {} });

    expect(config.headers.Authorization).toBeUndefined();
  });

  it('attaches the access token as a Bearer header once logged in', () => {
    store.dispatch(
      userLoggedIn({
        username: 'test1',
        accessToken: 'abc123',
        refreshToken: 'refresh-456',
        expiresAt: Date.now() + 300_000,
      }),
    );

    const config = attachAuthHeader({ headers: {} });

    expect(config.headers.Authorization).toBe('Bearer abc123');

    store.dispatch(userLoggedOut());
  });
});
