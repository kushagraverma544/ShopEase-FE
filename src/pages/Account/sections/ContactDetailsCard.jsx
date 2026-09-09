import { Mail, Phone, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '../../../components/common/Badge/Badge';
import { Card } from '../../../components/common/Card/Card';
import { Switch } from '../../../components/common/Switch/Switch';
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
          <p className="font-medium text-neutral-800">{value}</p>
        </div>
      </div>
      {verified ? <Badge variant="success">Verified</Badge> : null}
    </div>
  );
}

export function ContactDetailsCard({ contact }) {
  const [otpLoginEnabled, setOtpLoginEnabled] = useState(contact.otpLoginEnabled);

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2">
        <Phone className="h-5 w-5 text-primary-600" strokeWidth={1.75} />
        <h2 className="text-lg font-semibold text-neutral-900">Contact Details</h2>
      </div>

      <div className="mt-5 flex flex-col gap-4">
        <ContactRow icon={Mail} label="Email Address" value={contact.email} verified={contact.emailVerified} />
        <ContactRow icon={Phone} label="Mobile Number" value={contact.phone} verified={contact.phoneVerified} />
        <ContactRow icon={Phone} label="Alternate Number" value={contact.alternatePhone} />
      </div>

      <div
        className={cn(
          'mt-5 flex items-start gap-3 rounded-lg p-4 transition-colors duration-150',
          otpLoginEnabled ? 'bg-success-50' : 'bg-neutral-50',
        )}
      >
        <ShieldCheck
          className={cn(
            'mt-0.5 h-5 w-5 shrink-0',
            otpLoginEnabled ? 'text-success-600' : 'text-neutral-400',
          )}
          strokeWidth={1.75}
        />
        <div className="flex-1">
          <p
            className={cn(
              'text-sm font-medium',
              otpLoginEnabled ? 'text-success-600' : 'text-neutral-600',
            )}
          >
            Login with OTP {otpLoginEnabled ? 'is enabled' : 'is disabled'}
          </p>
          <p className="mt-0.5 text-xs text-neutral-500">
            A one-time password is sent to your registered mobile number every time you sign in.
          </p>
        </div>
        <Switch
          checked={otpLoginEnabled}
          onChange={setOtpLoginEnabled}
          label="Toggle login with OTP"
          className="mt-0.5 shrink-0"
        />
      </div>
    </Card>
  );
}
