import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { store } from '../../app/store';
import { selectCurrentUser, userLoggedOut } from '../../features/auth/authSlice';
import * as authService from '../../services/authService';
import { AuthPage } from './AuthPage';

vi.mock('../../services/authService');
vi.mock('../../services/unsplashService', () => ({
  getRandomPhoto: vi.fn().mockRejectedValue(new Error('no image in tests')),
}));

function renderAuthPage() {
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <AuthPage />
      </MemoryRouter>
    </Provider>,
  );
}

describe('AuthPage login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    store.dispatch(userLoggedOut());
  });

  it('logs in with username/password and stores the session in memory', async () => {
    authService.login.mockResolvedValue({
      accessToken: 'access-123',
      refreshToken: 'refresh-456',
      expiresIn: 300,
      tokenType: 'Bearer',
    });

    const { container } = renderAuthPage();
    const form = within(container.querySelector('form'));

    await userEvent.type(screen.getByLabelText('Username'), 'test1');
    await userEvent.type(screen.getByLabelText('Password'), 'password');
    await userEvent.click(form.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(selectCurrentUser(store.getState())).toEqual({ username: 'test1' });
    });

    expect(authService.login).toHaveBeenCalledWith({ username: 'test1', password: 'password' });
    expect(store.getState().auth.accessToken).toBe('access-123');
  });

  it('shows the server error message on invalid credentials and does not log in', async () => {
    authService.login.mockRejectedValue(new Error('Invalid username or password'));

    const { container } = renderAuthPage();
    const form = within(container.querySelector('form'));

    await userEvent.type(screen.getByLabelText('Username'), 'test1');
    await userEvent.type(screen.getByLabelText('Password'), 'wrong-password');
    await userEvent.click(form.getByRole('button', { name: 'Login' }));

    expect(await screen.findByText('Invalid username or password')).toBeInTheDocument();
    expect(selectCurrentUser(store.getState())).toBeNull();
  });
});
