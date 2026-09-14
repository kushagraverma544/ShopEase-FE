import { Pencil, User, X } from 'lucide-react';
import { useState } from 'react';

import { Banner } from '../../../components/common/Banner/Banner';
import { Button } from '../../../components/common/Button/Button';
import { Card } from '../../../components/common/Card/Card';
import { IconButton } from '../../../components/common/IconButton/IconButton';
import { Input } from '../../../components/common/Input/Input';
import { updatePersonalDetails } from '../../../services/meService';

const GENDER_OPTIONS = ['Male', 'Female', 'Other', 'Prefer not to say'];

function DetailRow({ label, value }) {
  return (
    <div className="text-center">
      <p className="text-xs text-neutral-400">{label}</p>
      <p className="mt-1 font-medium text-neutral-800">{value || '—'}</p>
    </div>
  );
}

export function PersonalDetailsCard({ details, onUpdated }) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [banner, setBanner] = useState(null);

  function startEditing() {
    setForm({
      fullName: details.fullName ?? '',
      gender: details.gender ?? '',
      dateOfBirth: details.dateOfBirth ?? '',
      preferredLanguage: details.preferredLanguage ?? '',
    });
    setIsEditing(true);
  }

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    try {
      const updated = await updatePersonalDetails(form);
      onUpdated(updated);
      setIsEditing(false);
      setBanner({ variant: 'success', message: 'Personal details updated.' });
    } catch (err) {
      setBanner({ variant: 'error', message: err.message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary-600" strokeWidth={1.75} />
          <h2 className="text-lg font-semibold text-neutral-900">Personal Details</h2>
        </div>
        {isEditing ? (
          <IconButton icon={X} label="Cancel" size="sm" onClick={() => setIsEditing(false)} />
        ) : (
          <IconButton icon={Pencil} label="Edit personal details" size="sm" onClick={startEditing} />
        )}
      </div>

      {banner ? (
        <Banner
          variant={banner.variant}
          message={banner.message}
          onDismiss={() => setBanner(null)}
          className="mt-5"
        />
      ) : null}

      {isEditing ? (
        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-neutral-700" htmlFor="personal-fullName">
                Full Name
              </label>
              <Input
                id="personal-fullName"
                required
                value={form.fullName}
                onChange={(event) => updateField('fullName', event.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-neutral-700" htmlFor="personal-gender">
                Gender
              </label>
              <select
                id="personal-gender"
                value={form.gender}
                onChange={(event) => updateField('gender', event.target.value)}
                className="h-10 w-full rounded-md border border-neutral-200 bg-neutral-0 px-3 text-sm text-neutral-800 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:outline-none"
              >
                <option value="">Select…</option>
                {GENDER_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-neutral-700" htmlFor="personal-dob">
                Date of Birth
              </label>
              <Input
                id="personal-dob"
                type="date"
                value={form.dateOfBirth}
                onChange={(event) => updateField('dateOfBirth', event.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-neutral-700" htmlFor="personal-language">
                Preferred Language
              </label>
              <Input
                id="personal-language"
                value={form.preferredLanguage}
                onChange={(event) => updateField('preferredLanguage', event.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving…' : 'Save'}
            </Button>
            <Button type="button" variant="secondary" onClick={() => setIsEditing(false)} disabled={submitting}>
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-5 text-sm sm:grid-cols-4">
          <DetailRow label="Full Name" value={details.fullName} />
          <DetailRow label="Gender" value={details.gender} />
          <DetailRow label="Date of Birth" value={details.dateOfBirth} />
          <DetailRow label="Preferred Language" value={details.preferredLanguage} />
        </div>
      )}
    </Card>
  );
}
