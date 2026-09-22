import { AlertTriangle, CheckCircle2, RotateCcw, Send, XCircle } from 'lucide-react';

// Static class lookups (never string-interpolated) so Tailwind's build-time
// scanner can see every class used here.
const ENTRY_STYLE = {
  submitted: {
    icon: Send,
    iconBg: 'bg-primary-50 dark:bg-primary-500/15',
    iconColor: 'text-primary-600 dark:text-primary-400',
    line: 'bg-primary-400',
  },
  hold: {
    icon: AlertTriangle,
    iconBg: 'bg-warning-50 dark:bg-warning-500/15',
    iconColor: 'text-warning-600 dark:text-warning-400',
    line: 'bg-warning-400',
  },
  resubmitted: {
    icon: RotateCcw,
    iconBg: 'bg-primary-50 dark:bg-primary-500/15',
    iconColor: 'text-primary-600 dark:text-primary-400',
    line: 'bg-primary-400',
  },
  approved: {
    icon: CheckCircle2,
    iconBg: 'bg-success-50 dark:bg-success-500/15',
    iconColor: 'text-success-600 dark:text-success-400',
    line: 'bg-success-400',
  },
  rejected: {
    icon: XCircle,
    iconBg: 'bg-danger-50 dark:bg-danger-500/15',
    iconColor: 'text-danger-600 dark:text-danger-400',
    line: 'bg-danger-400',
  },
  revoked: {
    icon: XCircle,
    iconBg: 'bg-neutral-100 dark:bg-neutral-700',
    iconColor: 'text-neutral-500 dark:text-neutral-400',
    line: 'bg-neutral-300 dark:bg-neutral-600',
  },
};

const ENTRY_LABEL = {
  submitted: 'Application submitted',
  hold: 'Put on hold',
  resubmitted: 'Resubmitted after correction',
  approved: 'Approved',
  rejected: 'Rejected',
  revoked: 'Application withdrawn',
};

function classifyEntry(entry) {
  if (entry.fromStatus === null) return 'submitted';
  if (entry.toStatus === 'HOLD') return 'hold';
  if (entry.fromStatus === 'HOLD' && entry.toStatus === 'PENDING') return 'resubmitted';
  if (entry.toStatus === 'APPROVED') return 'approved';
  if (entry.toStatus === 'REJECTED') return 'rejected';
  if (entry.toStatus === 'REVOKED') return 'revoked';
  return 'submitted';
}

function formatDateTime(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
}

// Read-only activity log for one seller application — fed by
// GET /admin/sellers/{id}/history (admin) or GET /seller/history (the
// applicant's own), same SellerApplicationHistoryEntry[] shape either way.
export function ApplicationHistoryTimeline({ history, viewerIsAdmin = false }) {
  if (!history?.length) return null;

  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold text-neutral-900 dark:text-neutral-50">
        Application History
      </h3>
      <ol className="flex flex-col">
        {history.map((entry, index) => {
          const kind = classifyEntry(entry);
          const style = ENTRY_STYLE[kind];
          const Icon = style.icon;
          const isLast = index === history.length - 1;
          const actorLabel =
            entry.actor === 'ADMIN' ? (viewerIsAdmin ? 'You (reviewer)' : 'Reviewer') : 'You';

          return (
            <li key={`${entry.occurredAt}-${index}`} className="relative flex gap-3 pb-6 last:pb-0">
              {!isLast ? (
                <span
                  className={`absolute top-8 left-4 h-[calc(100%-1.5rem)] w-px ${style.line}`}
                />
              ) : null}
              <span
                className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${style.iconBg}`}
              >
                <Icon className={`h-4 w-4 ${style.iconColor}`} strokeWidth={1.75} />
              </span>
              <div className="flex-1 pt-1">
                <p className="text-sm font-medium text-neutral-800 dark:text-neutral-100">
                  {ENTRY_LABEL[kind]}
                </p>
                {entry.remark ? (
                  <p className="mt-0.5 text-sm font-medium text-danger-600 dark:text-danger-400">
                    {entry.remark}
                  </p>
                ) : null}
                <p className="mt-0.5 text-xs text-neutral-400 dark:text-neutral-500">
                  {formatDateTime(entry.occurredAt)} · {actorLabel}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
