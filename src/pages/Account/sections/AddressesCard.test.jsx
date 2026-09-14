import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import * as meService from '../../../services/meService';
import { AddressesCard } from './AddressesCard';

vi.mock('../../../services/meService');

const HOME_ADDRESS = {
  id: 1,
  type: 'HOME',
  recipientName: 'Rohan Verma',
  phone: '+91 98765 43210',
  addressLine1: '402, Silver Oak Apartments',
  addressLine2: null,
  city: 'Bengaluru',
  state: 'Karnataka',
  pincode: '560038',
  defaultAddress: true,
};

async function fillRequiredFields() {
  await userEvent.type(screen.getByLabelText('Full Name'), 'Rohan Verma');
  await userEvent.type(screen.getByLabelText('Phone Number'), '+91 98765 43210');
  await userEvent.type(screen.getByLabelText('Address Line 1'), '402, Silver Oak Apartments');
  await userEvent.type(screen.getByLabelText('City'), 'Bengaluru');
  await userEvent.type(screen.getByLabelText('State'), 'Karnataka');
  await userEvent.type(screen.getByLabelText('Pincode'), '560038');
}

describe('AddressesCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('adds an address, refetches the list, and shows a success banner', async () => {
    meService.createAddress.mockResolvedValue(HOME_ADDRESS);
    meService.listAddresses.mockResolvedValue([HOME_ADDRESS]);
    const onAddressesChange = vi.fn();

    render(<AddressesCard addresses={[]} onAddressesChange={onAddressesChange} />);

    await userEvent.click(screen.getByRole('button', { name: /add new address/i }));
    await fillRequiredFields();
    await userEvent.click(screen.getByRole('button', { name: 'Save Address' }));

    expect(meService.createAddress).toHaveBeenCalled();
    expect(onAddressesChange).toHaveBeenCalledWith([HOME_ADDRESS]);
    expect(await screen.findByText('Address added.')).toBeInTheDocument();
  });

  it('shows an error banner and keeps the form open when adding fails', async () => {
    meService.createAddress.mockRejectedValue(new Error('recipientName is required'));

    render(<AddressesCard addresses={[]} onAddressesChange={vi.fn()} />);

    await userEvent.click(screen.getByRole('button', { name: /add new address/i }));
    await fillRequiredFields();
    await userEvent.click(screen.getByRole('button', { name: 'Save Address' }));

    expect(await screen.findByText('recipientName is required')).toBeInTheDocument();
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
  });

  it('deletes an address after confirming and shows a success banner', async () => {
    meService.deleteAddress.mockResolvedValue(undefined);
    meService.listAddresses.mockResolvedValue([]);
    const onAddressesChange = vi.fn();

    render(<AddressesCard addresses={[HOME_ADDRESS]} onAddressesChange={onAddressesChange} />);

    await userEvent.click(screen.getByRole('button', { name: 'Delete address' }));
    await userEvent.click(screen.getByRole('button', { name: 'Delete' }));

    expect(meService.deleteAddress).toHaveBeenCalledWith(HOME_ADDRESS.id);
    expect(onAddressesChange).toHaveBeenCalledWith([]);
    expect(await screen.findByText('Address deleted.')).toBeInTheDocument();
  });
});
