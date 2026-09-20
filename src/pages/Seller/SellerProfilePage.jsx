import {
  Banknote,
  Building2,
  CheckCircle2,
  Clock,
  MapPin,
  Store,
  Tag,
  XCircle,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

import { Badge } from '../../components/common/Badge/Badge';
import { Card } from '../../components/common/Card/Card';
import { ErrorState } from '../../components/common/ErrorState/ErrorState';
import { Skeleton } from '../../components/common/Skeleton/Skeleton';
import { getBusinessTypeLabel } from '../../constants/sellerBusinessTypes.constants';
import { getProductDetailsPath } from '../../routes/routePaths';
import { getSellerProfile } from '../../services/sellerApplicationService';

const STATUS_BADGE = {
  PENDING: { variant: 'warning', label: 'Under Review', icon: Clock },
  APPROVED: { variant: 'success', label: 'Approved', icon: CheckCircle2 },
  REJECTED: { variant: 'danger', label: 'Rejected', icon: XCircle },
};

// Masks all but the last 4 digits — bank account numbers stay sensitive even
// on the seller's own profile view.
function maskAccountNumber(accountNumber) {
  if (!accountNumber) return '—';
  const last4 = accountNumber.slice(-4);
  return `${'•'.repeat(Math.max(accountNumber.length - 4, 0))}${last4}`;
}

function InfoRow({ label, value }) {
  return (
    <div>
      <p className="text-xs text-neutral-400">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-neutral-800">{value || '—'}</p>
    </div>
  );
}

function SectionCard({ icon: Icon, title, children }) {
  return (
    <Card className="p-6">
      <div className="mb-5 flex items-center gap-2">
        <Icon className="h-5 w-5 text-primary-600" strokeWidth={1.75} />
        <h2 className="text-lg font-semibold text-neutral-900">{title}</h2>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
    </Card>
  );
}

// Read-only view of the SellerProfileResponse collected during registration
// (see BecomeSellerPage) — reachable only by an approved seller (SellerRoute
// guards this whole layout), so the 404-for-a-never-applied-customer case
// the BE contract mentions shouldn't normally surface here.
export function SellerProfilePage() {
  const [profile, setProfile] = useState(null);
  const [status, setStatus] = useState('loading');

  const fetchProfile = useCallback(() => {
    return getSellerProfile()
      .then((data) => {
        setProfile(data);
        setStatus('success');
      })
      .catch(() => setStatus('error'));
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  function loadProfile() {
    setStatus('loading');
    fetchProfile();
  }

  if (status === 'loading') {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <Skeleton className="mb-6 h-8 w-48" />
        <div className="flex flex-col gap-6">
          <Skeleton className="h-40 rounded-lg" />
          <Skeleton className="h-40 rounded-lg" />
          <Skeleton className="h-40 rounded-lg" />
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <ErrorState
          title="Couldn't load your seller profile"
          message="Something went wrong while fetching your registration details."
          onRetry={loadProfile}
        />
      </div>
    );
  }

  const statusBadge = STATUS_BADGE[profile.status];
  const StatusIcon = statusBadge?.icon;
  const pickupAddress = [profile.pickupAddressLine1, profile.pickupAddressLine2]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-neutral-900">Seller Profile</h1>
        {statusBadge ? (
          <Badge variant={statusBadge.variant} className="inline-flex items-center gap-1.5">
            {StatusIcon ? <StatusIcon className="h-3.5 w-3.5" strokeWidth={2} /> : null}
            {statusBadge.label}
          </Badge>
        ) : null}
      </div>

      {profile.status === 'REJECTED' && profile.rejectionReason ? (
        <div className="mb-6 flex items-start gap-3 rounded-lg bg-danger-50 p-4">
          <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-danger-600" strokeWidth={1.75} />
          <div>
            <p className="text-sm font-medium text-danger-600">Application rejected</p>
            <p className="mt-0.5 text-xs text-neutral-500">{profile.rejectionReason}</p>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-6">
        <SectionCard icon={Building2} title="Store & Business Details">
          <InfoRow label="Store Name" value={profile.storeName} />
          <InfoRow label="Business Name" value={profile.businessName} />
          <InfoRow label="Business Type" value={getBusinessTypeLabel(profile.businessType)} />
          <InfoRow label="Business Email" value={profile.businessEmail} />
          <InfoRow label="Business Phone" value={profile.businessPhone} />
        </SectionCard>

        <SectionCard icon={CheckCircle2} title="Tax & Compliance">
          <InfoRow label="Sells Only Books" value={profile.sellsOnlyBooks ? 'Yes' : 'No'} />
          <InfoRow label="GSTIN" value={profile.registrationNumber} />
          <InfoRow label="PAN Number" value={profile.panNumber} />
        </SectionCard>

        <SectionCard icon={Banknote} title="Bank Details">
          <InfoRow label="Account Holder" value={profile.bankAccountHolderName} />
          <InfoRow label="Account Number" value={maskAccountNumber(profile.bankAccountNumber)} />
          <InfoRow label="IFSC Code" value={profile.ifscCode} />
        </SectionCard>

        <SectionCard icon={MapPin} title="Pickup Address">
          <InfoRow label="Address" value={pickupAddress} />
          <InfoRow
            label="City / State"
            value={[profile.pickupCity, profile.pickupState].filter(Boolean).join(', ')}
          />
          <InfoRow label="Pincode" value={profile.pickupPincode} />
        </SectionCard>

        <Card className="p-6">
          <div className="mb-5 flex items-center gap-2">
            <Tag className="h-5 w-5 text-primary-600" strokeWidth={1.75} />
            <h2 className="text-lg font-semibold text-neutral-900">Categories</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.categories?.length ? (
              profile.categories.map((category) => (
                <Badge key={category} variant="neutral">
                  {category}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-neutral-500">No categories on file.</p>
            )}
          </div>
          {profile.productId ? (
            <NavLink
              to={getProductDetailsPath(profile.productId)}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:underline"
            >
              <Store className="h-4 w-4" strokeWidth={1.75} />
              View your first listing
            </NavLink>
          ) : null}
        </Card>

        <Card className="p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InfoRow
              label="Applied On"
              value={profile.appliedAt ? new Date(profile.appliedAt).toLocaleDateString() : null}
            />
            <InfoRow
              label="Reviewed On"
              value={profile.reviewedAt ? new Date(profile.reviewedAt).toLocaleDateString() : null}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}

export default SellerProfilePage;
