import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import * as meService from '../../../services/meService';
import { PersonalDetailsCard } from './PersonalDetailsCard';

vi.mock('../../../services/meService');

const DETAILS = {
  fullName: 'Rohan Verma',
  gender: null,
  dateOfBirth: null,
  preferredLanguage: null,
};

describe('PersonalDetailsCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('saves edited fields via PATCH /me/personal-details and reports the response back up', async () => {
    const updated = { ...DETAILS, fullName: 'Rohan V. Verma', gender: 'Male' };
    meService.updatePersonalDetails.mockResolvedValue(updated);
    const onUpdated = vi.fn();

    render(<PersonalDetailsCard details={DETAILS} onUpdated={onUpdated} />);

    await userEvent.click(screen.getByRole('button', { name: 'Edit personal details' }));

    const nameInput = screen.getByLabelText('Full Name');
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'Rohan V. Verma');
    await userEvent.selectOptions(screen.getByLabelText('Gender'), 'Male');

    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(meService.updatePersonalDetails).toHaveBeenCalledWith({
      fullName: 'Rohan V. Verma',
      gender: 'Male',
      dateOfBirth: '',
      preferredLanguage: '',
    });
    expect(onUpdated).toHaveBeenCalledWith(updated);
    expect(await screen.findByText('Personal details updated.')).toBeInTheDocument();
  });

  it('shows the server error and keeps the form open when the save fails', async () => {
    meService.updatePersonalDetails.mockRejectedValue(new Error('fullName is required'));
    const onUpdated = vi.fn();

    render(<PersonalDetailsCard details={DETAILS} onUpdated={onUpdated} />);

    await userEvent.click(screen.getByRole('button', { name: 'Edit personal details' }));
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(await screen.findByText('fullName is required')).toBeInTheDocument();
    expect(onUpdated).not.toHaveBeenCalled();
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
  });
});
