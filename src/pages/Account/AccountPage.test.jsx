import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { store } from '../../app/store';
import * as meService from '../../services/meService';
import { AccountPage } from './AccountPage';

vi.mock('../../services/meService');
vi.mock('../../services/unsplashService', () => ({
  getRandomPhoto: vi.fn().mockRejectedValue(new Error('no image in tests')),
}));

const BASE_DETAILS = {
  id: 5,
  fullName: 'Rohan Verma',
  email: 'rohan.verma@example.com',
  emailVerified: true,
  gender: null,
  dateOfBirth: null,
  preferredLanguage: null,
  mobileNumber: '+91 98765 43210',
  alternateNumber: null,
  mobileVerified: true,
  otpLoginEnabled: false,
  addresses: [],
};

function renderAccountPage() {
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <AccountPage />
      </MemoryRouter>
    </Provider>,
  );
}

describe('AccountPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads /me and shows profile completion based on the response', async () => {
    meService.getMyDetails.mockResolvedValue(BASE_DETAILS);

    renderAccountPage();

    expect(await screen.findByRole('heading', { name: 'Rohan Verma' })).toBeInTheDocument();
    // fullName + mobileNumber done out of 7 tracked fields = 2/7 -> 29%
    expect(screen.getByText('29%')).toBeInTheDocument();
    expect(screen.getByText(/2 of 7 details added/)).toBeInTheDocument();
  });

  it('shows a retry option when /me fails, and recovers on retry', async () => {
    meService.getMyDetails
      .mockRejectedValueOnce(new Error('network error'))
      .mockResolvedValueOnce(BASE_DETAILS);

    renderAccountPage();

    const retryButton = await screen.findByRole('button', { name: /try again/i });
    await userEvent.click(retryButton);

    expect(await screen.findByRole('heading', { name: 'Rohan Verma' })).toBeInTheDocument();
    expect(meService.getMyDetails).toHaveBeenCalledTimes(2);
  });
});
