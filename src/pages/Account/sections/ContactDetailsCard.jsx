import { Mail, Pencil, Phone, ShieldCheck, X } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '../../../components/common/Badge/Badge';
import { Banner } from '../../../components/common/Banner/Banner';
import { Button } from '../../../components/common/Button/Button';
import { Card } from '../../../components/common/Card/Card';
import { IconButton } from '../../../components/common/IconButton/IconButton';
import { Input } from '../../../components/common/Input/Input';
import { Switch } from '../../../components/common/Switch/Switch';
import { updateContactDetails, updateSecurityPreference } from '../../../services/meService';
import { cn } from '../../../utils/cn';

function ContactRow({ icon: Icon, label, value, verified }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-50">
          <Icon className="h-4 w-4 text-primary-600" strokeWidth={1.75} />
        </span>
        <div>
          <p className="text-xs text-neutral-400">{label}</p>
          <p className="font-medium text-neutral-800">{value || '—'}</p>
        </div>
      </div>
      {verified ? <Badge variant="success">Verified</Badge> : null}
    </div>
  );
}

export function ContactDetailsCard({ details, onUpdated }) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [banner, setBanner] = useState(null);
  const [otpUpdating, setOtpUpdating] = useState(false);

  function startEditing() {
    setForm({
      mobileNumber: details.mobileNumber ?? '',
      alternateNumber: details.alternateNumber ?? '',
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
      const updated = await updateContactDetails(form);
      onUpdated(updated);
      setIsEditing(false);
      setBanner({ variant: 'success', message: 'Contact details updated.' });
    } catch (err) {
      setBanner({ variant: 'error', message: err.message });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleOtpToggle(nextValue) {
    setOtpUpdating(true);
    try {
      const updated = await updateSecurityPreference({ otpLoginEnabled: nextValue });
      onUpdated(updated);
      setBanner({
        variant: 'success',
        message: `Login with OTP ${nextValue ? 'enabled' : 'disabled'}.`,
      });
    } catch (err) {
      setBanner({ variant: 'error', message: err.message });
    } finally {
      setOtpUpdating(false);
    }
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Phone className="h-5 w-5 text-primary-600" strokeWidth={1.75} />
          <h2 className="text-lg font-semibold text-neutral-900">Contact Details</h2>
        </div>
        {isEditing ? (
          <IconButton icon={X} label="Cancel" size="sm" onClick={() => setIsEditing(false)} />
        ) : (
          <IconButton icon={Pencil} label="Edit contact details" size="sm" onClick={startEditing} />
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
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-neutral-700" htmlFor="contact-mobile">
              Mobile Number
            </label>
            <Input
              id="contact-mobile"
              type="tel"
              value={form.mobileNumber}
              onChange={(event) => updateField('mobileNumber', event.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-neutral-700" htmlFor="contact-alternate">
              Alternate Number
            </label>
            <Input
              id="contact-alternate"
              type="tel"
              value={form.alternateNumber}
              onChange={(event) => updateField('alternateNumber', event.target.value)}
            />
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
        <div className="mt-5 flex flex-col gap-4">
          <ContactRow icon={Mail} label="Email Address" value={details.email} verified={details.emailVerified} />
          <ContactRow
            icon={Phone}
            label="Mobile Number"
            value={details.mobileNumber}
            verified={details.mobileVerified}
          />
          <ContactRow icon={Phone} label="Alternate Number" value={details.alternateNumber} />
        </div>
      )}

      <div
        className={cn(
          'mt-5 flex items-start gap-3 rounded-lg p-4 transition-colors duration-150',
          details.otpLoginEnabled ? 'bg-success-50' : 'bg-neutral-50',
        )}
      >
        <ShieldCheck
          className={cn(
            'mt-0.5 h-5 w-5 shrink-0',
            details.otpLoginEnabled ? 'text-success-600' : 'text-neutral-400',
          )}
          strokeWidth={1.75}
        />
        <div className="flex-1">
          <p
            className={cn(
              'text-sm font-medium',
              details.otpLoginEnabled ? 'text-success-600' : 'text-neutral-600',
            )}
          >
            Login with OTP {details.otpLoginEnabled ? 'is enabled' : 'is disabled'}
          </p>
          <p className="mt-0.5 text-xs text-neutral-500">
            A one-time password is sent to your registered mobile number every time you sign in.
          </p>
        </div>
        <Switch
          checked={details.otpLoginEnabled}
          onChange={handleOtpToggle}
          label="Toggle login with OTP"
          className={cn('mt-0.5 shrink-0', otpUpdating && 'pointer-events-none opacity-50')}
        />
      </div>
    </Card>
  );
}
