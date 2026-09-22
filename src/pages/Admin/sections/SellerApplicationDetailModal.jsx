import {
  AlertTriangle,
  ArrowLeft,
  Banknote,
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  MapPin,
  Tag,
  X,
  XCircle,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import { ApplicationHistoryTimeline } from '../../../components/common/ApplicationHistoryTimeline/ApplicationHistoryTimeline';
import { Badge } from '../../../components/common/Badge/Badge';
import { Banner } from '../../../components/common/Banner/Banner';
import { Button } from '../../../components/common/Button/Button';
import { Card } from '../../../components/common/Card/Card';
import { IconButton } from '../../../components/common/IconButton/IconButton';
import { getBusinessTypeLabel } from '../../../constants/sellerBusinessTypes.constants';
import {
  approveSellerApplication,
  getSellerApplicationHistory,
  holdSellerApplication,
  rejectSellerApplication,
} from '../../../services/adminService';
import { cn } from '../../../utils/cn';

// Subtle gradient fills for the three review-decision buttons — layered on
// top of Button's own bg-{color} via className (background-image over
// background-color, no conflict), matching the gradient already used on
// AdminSidebar rather than introducing a new visual language.
const GRADIENT_DANGER =
  'bg-gradient-to-b from-danger-500 to-danger-600 hover:brightness-110 active:brightness-95';
const GRADIENT_WARNING =
  'border-transparent bg-gradient-to-b from-warning-500 to-warning-600 text-neutral-0 hover:brightness-110 active:brightness-95';
const GRADIENT_PRIMARY =
  'bg-gradient-to-b from-primary-500 to-primary-700 hover:brightness-110 active:brightness-95';

const STATUS_BADGE = {
  PENDING: { variant: 'warning', label: 'Under Review' },
  HOLD: { variant: 'warning', label: 'On Hold' },
  APPROVED: { variant: 'success', label: 'Approved' },
  REJECTED: { variant: 'danger', label: 'Rejected' },
};

function formatDateTime(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
}

function InfoRow({ label, value }) {
  return (
    <div>
      <p className="text-xs text-neutral-400 dark:text-neutral-500">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-neutral-800 dark:text-neutral-100">
        {value || '—'}
      </p>
    </div>
  );
}

// KYC fields (PAN, bank account, IFSC) default to masked — the backend sends
// them unmasked already, masking + reveal is purely an FE display choice
// per the admin spec.
function RevealableField({ label, value }) {
  const [revealed, setRevealed] = useState(false);
  const masked = value ? `${'•'.repeat(Math.max(value.length - 4, 0))}${value.slice(-4)}` : '—';

  return (
    <div>
      <p className="text-xs text-neutral-400 dark:text-neutral-500">{label}</p>
      <div className="mt-0.5 flex items-center gap-1.5">
        <p className="text-sm font-medium text-neutral-800 dark:text-neutral-100">
          {revealed ? value || '—' : masked}
        </p>
        {value ? (
          <IconButton
            icon={revealed ? EyeOff : Eye}
            label={revealed ? `Hide ${label}` : `Reveal ${label}`}
            size="sm"
            tooltip
            onClick={() => setRevealed((current) => !current)}
          />
        ) : null}
      </div>
    </div>
  );
}

function SectionCard({ icon: Icon, title, children }) {
  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary-600 dark:text-primary-400" strokeWidth={1.75} />
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">{title}</h3>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
    </Card>
  );
}

// Read-only detail + Approve/Reject actions for one row from
// AdminSellerApplicationsPage's list — no separate GET by id, the list
// endpoint already returns the full SellerProfileResponse per application.
//
// Rendered in-flow inside AdminLayout's content area (AdminSellerApplications
// Page swaps its list for this instead of the tabs/table) rather than as a
// fixed/portal overlay — a full-viewport overlay hid AdminHeader/AdminSidebar,
// this way both stay visible/usable while an admin reviews an application.
export function SellerApplicationDetailModal({ application, onClose, onUpdated }) {
  const [confirmingApprove, setConfirmingApprove] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState('');
  const [holding, setHolding] = useState(false);
  const [holdRemark, setHoldRemark] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [banner, setBanner] = useState(null);
  const [history, setHistory] = useState([]);

  const fetchHistory = useCallback(() => {
    if (!application?.id) return undefined;
    return getSellerApplicationHistory(application.id)
      .then(setHistory)
      .catch(() => setHistory([]));
  }, [application]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  function resetActionState() {
    setConfirmingApprove(false);
    setRejecting(false);
    setReason('');
    setHolding(false);
    setHoldRemark('');
    setBanner(null);
  }

  if (!application) return null;

  const statusBadge = STATUS_BADGE[application.status];
  const pickupAddress = [application.pickupAddressLine1, application.pickupAddressLine2]
    .filter(Boolean)
    .join(', ');
  const isPending = application.status === 'PENDING';

  function closeModal() {
    resetActionState();
    onClose();
  }

  async function handleApprove() {
    setSubmitting(true);
    try {
      const updated = await approveSellerApplication(application.id);
      resetActionState();
      onUpdated(updated);
    } catch (err) {
      // 409 lands here too (already reviewed by another admin) — the message
      // from httpClient's interceptor is shown as-is; re-opening this same
      // row after a list refetch will show the real current status.
      setBanner({ variant: 'error', message: err.message });
      setConfirmingApprove(false);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleReject(event) {
    event.preventDefault();
    if (!reason.trim()) return;
    setSubmitting(true);
    try {
      const updated = await rejectSellerApplication(application.id, reason.trim());
      resetActionState();
      onUpdated(updated);
    } catch (err) {
      setBanner({ variant: 'error', message: err.message });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleHold(event) {
    event.preventDefault();
    if (!holdRemark.trim()) return;
    setSubmitting(true);
    try {
      const updated = await holdSellerApplication(application.id, holdRemark.trim());
      resetActionState();
      onUpdated(updated);
    } catch (err) {
      setBanner({ variant: 'error', message: err.message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col">
      <div className="sticky top-(--header-height) z-10 flex items-center gap-3 border-b border-neutral-100 bg-neutral-0 px-4 py-4 dark:border-neutral-700 dark:bg-neutral-800 sm:px-8">
        <IconButton icon={ArrowLeft} label="Back to applications" onClick={closeModal} />
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-50 dark:bg-primary-500/15">
          <Building2
            className="h-5 w-5 text-primary-600 dark:text-primary-400"
            strokeWidth={1.75}
          />
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-lg font-semibold text-neutral-900 dark:text-neutral-50">
            {application.storeName}
          </h1>
          <p className="truncate text-sm text-neutral-500 dark:text-neutral-400">
            {application.businessName}
          </p>
        </div>
        {statusBadge ? <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge> : null}
        <IconButton icon={X} label="Close" onClick={closeModal} />
      </div>

      <div className="px-4 py-6 sm:px-8">
        <div className="mx-auto flex max-w-5xl flex-col gap-6">
          {banner ? (
            <Banner
              variant={banner.variant}
              message={banner.message}
              onDismiss={() => setBanner(null)}
            />
          ) : null}

          {application.status === 'REJECTED' && application.adminRemark ? (
            <div className="flex items-start gap-3 rounded-lg bg-danger-50 p-4 dark:bg-danger-500/10">
              <XCircle
                className="mt-0.5 h-5 w-5 shrink-0 text-danger-600 dark:text-danger-400"
                strokeWidth={1.75}
              />
              <div>
                <p className="text-sm font-medium text-danger-600 dark:text-danger-400">
                  Application rejected
                </p>
                <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                  {application.adminRemark}
                </p>
              </div>
            </div>
          ) : null}

          {application.status === 'HOLD' && application.adminRemark ? (
            <div className="flex items-start gap-3 rounded-lg bg-warning-50 p-4 dark:bg-warning-500/10">
              <AlertTriangle
                className="mt-0.5 h-5 w-5 shrink-0 text-warning-600 dark:text-warning-400"
                strokeWidth={1.75}
              />
              <div>
                <p className="text-sm font-medium text-warning-600 dark:text-warning-400">
                  On hold — waiting on the applicant
                </p>
                <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                  {application.adminRemark}
                </p>
                {application.correctionSubmittedAt ? (
                  <p className="mt-1 text-xs font-medium text-primary-600 dark:text-primary-400">
                    Applicant has resubmitted a correction — re-review needed.
                  </p>
                ) : null}
              </div>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-x-10 gap-y-4">
            <InfoRow label="Applied On" value={formatDateTime(application.appliedAt)} />
            <InfoRow label="Reviewed On" value={formatDateTime(application.reviewedAt)} />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <SectionCard icon={Building2} title="Store & Business Details">
              <InfoRow label="Store Name" value={application.storeName} />
              <InfoRow label="Business Name" value={application.businessName} />
              <InfoRow
                label="Business Type"
                value={getBusinessTypeLabel(application.businessType)}
              />
              <InfoRow label="Business Email" value={application.businessEmail} />
              <InfoRow label="Business Phone" value={application.businessPhone} />
            </SectionCard>

            <SectionCard icon={CheckCircle2} title="Tax & Compliance">
              <InfoRow label="Sells Only Books" value={application.sellsOnlyBooks ? 'Yes' : 'No'} />
              <InfoRow label="GSTIN" value={application.registrationNumber} />
              <RevealableField label="PAN Number" value={application.panNumber} />
            </SectionCard>

            <SectionCard icon={Banknote} title="Bank Details">
              <InfoRow label="Account Holder" value={application.bankAccountHolderName} />
              <RevealableField label="Account Number" value={application.bankAccountNumber} />
              <RevealableField label="IFSC Code" value={application.ifscCode} />
            </SectionCard>

            <SectionCard icon={MapPin} title="Pickup Address">
              <InfoRow label="Address" value={pickupAddress} />
              <InfoRow
                label="City / State"
                value={[application.pickupCity, application.pickupState].filter(Boolean).join(', ')}
              />
              <InfoRow label="Pincode" value={application.pickupPincode} />
            </SectionCard>
          </div>

          <SectionCard icon={Tag} title="Categories">
            <div className="col-span-full flex flex-wrap gap-2">
              {application.categories?.length ? (
                application.categories.map((category) => (
                  <Badge key={category} variant="neutral">
                    {category}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  No categories on file.
                </p>
              )}
            </div>
          </SectionCard>

          {history.length ? (
            <Card className="p-5">
              <ApplicationHistoryTimeline history={history} viewerIsAdmin />
            </Card>
          ) : null}
        </div>
      </div>

      {isPending ? (
        <div className="border-t border-neutral-100 bg-neutral-0 px-4 py-4 dark:border-neutral-700 dark:bg-neutral-800 sm:px-8">
          <div className="mx-auto max-w-5xl">
            {rejecting ? (
              <form onSubmit={handleReject} className="flex flex-col gap-3">
                <label
                  className="text-sm font-medium text-neutral-700 dark:text-neutral-200"
                  htmlFor="reject-reason"
                >
                  Reason for rejection
                </label>
                <textarea
                  id="reject-reason"
                  required
                  rows={2}
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                  placeholder="e.g. PAN number document doesn't match business name"
                  className="w-full rounded-md border border-neutral-200 bg-neutral-0 px-3 py-2 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:outline-none dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-100 dark:placeholder:text-neutral-500"
                />
                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setRejecting(false);
                      setReason('');
                    }}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="danger"
                    disabled={submitting || !reason.trim()}
                    className={GRADIENT_DANGER}
                  >
                    <XCircle className="h-4 w-4" strokeWidth={1.75} />
                    {submitting ? 'Rejecting…' : 'Confirm Reject'}
                  </Button>
                </div>
              </form>
            ) : holding ? (
              <form onSubmit={handleHold} className="flex flex-col gap-3">
                <div className="flex items-start gap-3 rounded-lg bg-warning-50 p-3 dark:bg-warning-500/10">
                  <AlertTriangle
                    className="mt-0.5 h-4 w-4 shrink-0 text-warning-600 dark:text-warning-400"
                    strokeWidth={1.75}
                  />
                  <p className="text-xs text-warning-700 dark:text-warning-300">
                    This isn't a rejection — {application.storeName} keeps their application and can
                    correct + resubmit it once you describe what's needed below.
                  </p>
                </div>
                <label
                  className="text-sm font-medium text-neutral-700 dark:text-neutral-200"
                  htmlFor="hold-remark"
                >
                  What does the applicant need to fix?
                </label>
                <textarea
                  id="hold-remark"
                  required
                  rows={2}
                  value={holdRemark}
                  onChange={(event) => setHoldRemark(event.target.value)}
                  placeholder="e.g. Please provide a document containing your current address"
                  className="w-full rounded-md border border-neutral-200 bg-neutral-0 px-3 py-2 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-warning-500 focus:ring-2 focus:ring-warning-500 focus:outline-none dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-100 dark:placeholder:text-neutral-500"
                />
                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setHolding(false);
                      setHoldRemark('');
                    }}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting || !holdRemark.trim()}
                    className={cn(
                      GRADIENT_WARNING,
                      'disabled:bg-neutral-200 disabled:text-neutral-400 dark:disabled:bg-neutral-700 dark:disabled:text-neutral-500',
                    )}
                  >
                    <AlertTriangle className="h-4 w-4" strokeWidth={1.75} />
                    {submitting ? 'Putting on hold…' : 'Confirm Hold'}
                  </Button>
                </div>
              </form>
            ) : confirmingApprove ? (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-neutral-600 dark:text-neutral-300">
                  {application.storeName} will get seller access and their first listing will go
                  live immediately. Continue?
                </p>
                <div className="flex shrink-0 justify-end gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setConfirmingApprove(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={handleApprove}
                    disabled={submitting}
                    className={GRADIENT_PRIMARY}
                  >
                    <CheckCircle2 className="h-4 w-4" strokeWidth={1.75} />
                    {submitting ? 'Approving…' : 'Confirm Approve'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-medium text-neutral-400 uppercase dark:text-neutral-500">
                  Review decision
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="danger"
                    onClick={() => setRejecting(true)}
                    className={GRADIENT_DANGER}
                  >
                    <XCircle className="h-4 w-4" strokeWidth={1.75} />
                    Reject
                  </Button>
                  <Button onClick={() => setHolding(true)} className={GRADIENT_WARNING}>
                    <AlertTriangle className="h-4 w-4" strokeWidth={1.75} />
                    Put on Hold
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => setConfirmingApprove(true)}
                    className={GRADIENT_PRIMARY}
                  >
                    <CheckCircle2 className="h-4 w-4" strokeWidth={1.75} />
                    Approve
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
