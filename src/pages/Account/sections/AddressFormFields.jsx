import { LocateFixed } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Button } from '../../../components/common/Button/Button';
import { Input } from '../../../components/common/Input/Input';
import { Loader } from '../../../components/common/Loader/Loader';

const ADDRESS_TYPES = [
  { value: 'HOME', label: 'Home' },
  { value: 'WORK', label: 'Work' },
  { value: 'OTHER', label: 'Other' },
];

const EMPTY_FORM = {
  type: 'HOME',
  recipientName: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  pincode: '',
  defaultAddress: false,
};

export function AddressFormFields({ address, onCancel, onSave, submitLabel }) {
  const [form, setForm] = useState(
    address ? { ...EMPTY_FORM, ...address, addressLine2: address.addressLine2 ?? '' } : EMPTY_FORM,
  );
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const isMountedRef = useRef(true);

  useEffect(
    () => () => {
      isMountedRef.current = false;
    },
    [],
  );

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    // onSave (AddressesCard's handleAdd/handleEdit) reports its own outcome
    // via a Banner and never rethrows — on failure it just leaves this form
    // open so the user can fix and retry.
    await onSave(form);
    if (isMountedRef.current) setSubmitting(false);
  }

  function handleUseCurrentLocation() {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }

    setLocationError(null);
    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
          );
          if (!response.ok) throw new Error('Reverse geocoding failed');

          const data = await response.json();
          const place = data.address ?? {};

          setForm((current) => ({
            ...current,
            addressLine1: [place.house_number, place.road].filter(Boolean).join(' ') || current.addressLine1,
            addressLine2: place.suburb || place.neighbourhood || current.addressLine2,
            city: place.city || place.town || place.village || current.city,
            state: place.state || current.state,
            pincode: place.postcode || current.pincode,
          }));
        } catch {
          setLocationError("Couldn't detect your address. Please enter it manually.");
        } finally {
          setIsLocating(false);
        }
      },
      () => {
        setLocationError('Location access denied. Please enter your address manually.');
        setIsLocating(false);
      },
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <Button
          type="button"
          variant="primary"
          fullWidth
          onClick={handleUseCurrentLocation}
          disabled={isLocating}
        >
          {isLocating ? <Loader size="sm" /> : <LocateFixed className="h-4 w-4" strokeWidth={1.75} />}
          {isLocating ? 'Detecting your location…' : 'Use my current location'}
        </Button>
        {locationError ? <p className="mt-2 text-xs text-danger-600">{locationError}</p> : null}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-neutral-700" htmlFor={`${address?.id ?? 'new'}-recipientName`}>
            Full Name
          </label>
          <Input
            id={`${address?.id ?? 'new'}-recipientName`}
            required
            value={form.recipientName}
            onChange={(event) => updateField('recipientName', event.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-neutral-700" htmlFor={`${address?.id ?? 'new'}-phone`}>
            Phone Number
          </label>
          <Input
            id={`${address?.id ?? 'new'}-phone`}
            type="tel"
            required
            value={form.phone}
            onChange={(event) => updateField('phone', event.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-neutral-700" htmlFor={`${address?.id ?? 'new'}-addressLine1`}>
          Address Line 1
        </label>
        <Input
          id={`${address?.id ?? 'new'}-addressLine1`}
          required
          value={form.addressLine1}
          onChange={(event) => updateField('addressLine1', event.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-neutral-700" htmlFor={`${address?.id ?? 'new'}-addressLine2`}>
          Address Line 2
        </label>
        <Input
          id={`${address?.id ?? 'new'}-addressLine2`}
          value={form.addressLine2}
          onChange={(event) => updateField('addressLine2', event.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-neutral-700" htmlFor={`${address?.id ?? 'new'}-city`}>
            City
          </label>
          <Input
            id={`${address?.id ?? 'new'}-city`}
            required
            value={form.city}
            onChange={(event) => updateField('city', event.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-neutral-700" htmlFor={`${address?.id ?? 'new'}-state`}>
            State
          </label>
          <Input
            id={`${address?.id ?? 'new'}-state`}
            required
            value={form.state}
            onChange={(event) => updateField('state', event.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-neutral-700" htmlFor={`${address?.id ?? 'new'}-pincode`}>
            Pincode
          </label>
          <Input
            id={`${address?.id ?? 'new'}-pincode`}
            required
            value={form.pincode}
            onChange={(event) => updateField('pincode', event.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <span className="text-sm font-medium text-neutral-700">Address Type</span>
        {ADDRESS_TYPES.map(({ value, label }) => (
          <label key={value} className="flex items-center gap-2 text-sm text-neutral-700">
            <input
              type="radio"
              name={`address-type-${address?.id ?? 'new'}`}
              checked={form.type === value}
              onChange={() => updateField('type', value)}
              className="h-4 w-4 border-neutral-300 text-primary-600 focus:ring-primary-500"
            />
            {label}
          </label>
        ))}
      </div>

      <label className="flex items-center gap-2 text-sm text-neutral-700">
        <input
          type="checkbox"
          checked={form.defaultAddress}
          onChange={(event) => updateField('defaultAddress', event.target.checked)}
          className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
        />
        Make this my default address
      </label>

      <div className="flex justify-end gap-3">
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving…' : submitLabel}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
