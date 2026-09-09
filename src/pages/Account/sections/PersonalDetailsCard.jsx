import { User } from 'lucide-react';

import { Card } from '../../../components/common/Card/Card';

function DetailRow({ label, value }) {
  return (
    <div className="text-center">
      <p className="text-xs text-neutral-400">{label}</p>
      <p className="mt-1 font-medium text-neutral-800">{value}</p>
    </div>
  );
}

export function PersonalDetailsCard({ personal }) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-center gap-2">
        <User className="h-5 w-5 text-primary-600" strokeWidth={1.75} />
        <h2 className="text-lg font-semibold text-neutral-900">Personal Details</h2>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-5 text-sm sm:grid-cols-4">
        <DetailRow label="Full Name" value={personal.fullName} />
        <DetailRow label="Gender" value={personal.gender} />
        <DetailRow label="Date of Birth" value={personal.dateOfBirth} />
        <DetailRow label="Preferred Language" value={personal.preferredLanguage} />
      </div>
    </Card>
  );
}
