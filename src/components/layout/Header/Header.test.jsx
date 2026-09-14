import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { store } from '../../../app/store';
import { userLoggedIn, userLoggedOut } from '../../../features/auth/authSlice';
import * as meService from '../../../services/meService';
import { Header } from './Header';

vi.mock('../../../services/meService');

function renderHeader() {
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    </Provider>,
  );
}

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    store.dispatch(userLoggedOut());
  });

  it('fetches /me once to resolve the full name and shows it instead of the username', async () => {
    meService.getMyDetails.mockResolvedValue({ fullName: 'Rohan Verma' });
    store.dispatch(userLoggedIn({ username: 'test1', accessToken: 'abc', refreshToken: 'def' }));

    renderHeader();

    expect(await screen.findByText('Rohan Verma')).toBeInTheDocument();
    expect(meService.getMyDetails).toHaveBeenCalledTimes(1);
  });

  it('does not fetch /me for a logged-out visitor', () => {
    renderHeader();

    expect(meService.getMyDetails).not.toHaveBeenCalled();
  });
});
