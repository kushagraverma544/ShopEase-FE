import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { store } from '../../../app/store';
import { ProfileMenu } from './ProfileMenu';

function renderProfileMenu(currentUser) {
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <ProfileMenu currentUser={currentUser} />
      </MemoryRouter>
    </Provider>,
  );
}

describe('ProfileMenu', () => {
  it('prefers the full name over the username next to the profile icon', () => {
    renderProfileMenu({ username: 'test1', fullName: 'Rohan Verma' });

    expect(screen.getByText('Rohan Verma')).toBeInTheDocument();
    expect(screen.queryByText('test1')).not.toBeInTheDocument();
  });

  it('falls back to the username while the full name has not loaded yet', () => {
    renderProfileMenu({ username: 'test1', fullName: null });

    expect(screen.getByText('test1')).toBeInTheDocument();
  });

  it('shows an icon-only "Account" trigger when logged out', () => {
    renderProfileMenu(null);

    expect(screen.getByRole('button', { name: 'Account' })).toBeInTheDocument();
  });
});
