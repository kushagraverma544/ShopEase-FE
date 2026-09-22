import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  CreditCard,
  ShoppingCart,
  Truck,
  XCircle,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';

import { Badge } from '../../components/common/Badge/Badge';
import { Button } from '../../components/common/Button/Button';
import { Card } from '../../components/common/Card/Card';
import { ErrorState } from '../../components/common/ErrorState/ErrorState';
import { Skeleton } from '../../components/common/Skeleton/Skeleton';
import { Table } from '../../components/common/Table/Table';
import { getBusinessTypeLabel } from '../../constants/sellerBusinessTypes.constants';
import { ROUTE_PATHS } from '../../routes/routePaths';
import { getSellerApplications } from '../../services/adminService';
import { cn } from '../../utils/cn';
import { formatRelativeDate } from '../../utils/formatRelativeDate';

// Real counts, derived from the same GET /admin/sellers?status={status} that
// backs the Seller Applications screen (three calls, one per status — there
// is no single "counts" endpoint).
const APPLICATION_STAT_CARDS = [
  { key: 'PENDING', label: 'Pending Applications', icon: Clock, color: 'warning' },
  { key: 'APPROVED', label: 'Approved Sellers', icon: CheckCircle2, color: 'success' },
  { key: 'REJECTED', label: 'Rejected Applications', icon: XCircle, color: 'danger' },
];

// No backend yet for orders/deliveries/payments (see admin functional spec —
// only Module 1 is live) — shown as clearly-labelled preview data instead of
// leaving the dashboard looking incomplete, same "mock value" convention
// SellerDashboardPage already uses.
const MOCK_STAT_CARDS = [
  { key: 'ordersToday', label: "Today's Orders", icon: ShoppingCart, color: 'primary', value: 128 },
  { key: 'failedDeliveries', label: 'Failed Deliveries', icon: Truck, color: 'danger', value: 6 },
  { key: 'paymentIssues', label: 'Payment Issues', icon: CreditCard, color: 'warning', value: 3 },
];

// Top 5 most recently applied PENDING applications — reuses the same
// GET /admin/sellers?status=PENDING call the stat card above already makes,
// just sorted/sliced client-side (no separate "recent" endpoint exists).
const RECENT_PENDING_COLUMNS = [
  {
    key: 'store',
    header: 'Store',
    render: (application) => (
      <div>
        <p className="font-medium text-neutral-900 dark:text-neutral-50">{application.storeName}</p>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">{application.businessName}</p>
      </div>
    ),
  },
  {
    key: 'businessType',
    header: 'Business Type',
    render: (application) => (
      <span className="text-neutral-600 dark:text-neutral-300">
        {getBusinessTypeLabel(application.businessType)}
      </span>
    ),
  },
  {
    key: 'appliedAt',
    header: 'Applied',
    align: 'right',
    render: (application) => (
      <span className="text-neutral-500 dark:text-neutral-400">
        {formatRelativeDate(application.appliedAt)}
      </span>
    ),
  },
];

const COLOR_CLASSES = {
  primary: 'bg-primary-50 text-primary-600 dark:bg-primary-500/15 dark:text-primary-400',
  success: 'bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-400',
  warning: 'bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-warning-400',
  danger: 'bg-danger-50 text-danger-600 dark:bg-danger-500/15 dark:text-danger-400',
};

function StatCard({ icon: Icon, color, label, value, loading, badge }) {
  return (
    <Card className="flex items-start justify-between gap-4 p-5">
      <div>
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{label}</p>
          {badge ? (
            <Badge variant="neutral" className="text-2xs">
              {badge}
            </Badge>
          ) : null}
        </div>
        {loading ? (
          <Skeleton className="mt-2 h-8 w-16" />
        ) : (
          <p className="mt-1 text-3xl font-bold tabular-nums text-neutral-900 dark:text-neutral-50">
            {value}
          </p>
        )}
      </div>
      <span className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-full', COLOR_CLASSES[color])}>
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </span>
    </Card>
  );
}

// Landing page of the Admin Console. Only the application counts are real
// (via adminService); everything else is a placeholder for modules that
// don't have a backend yet (Orders/Payments — see nav.constants.js).
export function AdminDashboardPage() {
  const [counts, setCounts] = useState(null);
  const [recentPending, setRecentPending] = useState([]);
  const [status, setStatus] = useState('loading');
  const isMountedRef = useRef(false);

  const loadCounts = useCallback(() => {
    return Promise.all(
      APPLICATION_STAT_CARDS.map((card) => getSellerApplications(card.key)),
    )
      .then((results) => {
        if (!isMountedRef.current) return;
        const resultsByStatus = {};
        APPLICATION_STAT_CARDS.forEach((card, index) => {
          resultsByStatus[card.key] = results[index];
        });

        const next = {};
        APPLICATION_STAT_CARDS.forEach((card) => {
          next[card.key] = resultsByStatus[card.key].length;
        });
        setCounts(next);

        const sortedPending = [...resultsByStatus.PENDING].sort(
          (a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime(),
        );
        setRecentPending(sortedPending.slice(0, 5));

        setStatus('success');
      })
      .catch(() => {
        if (isMountedRef.current) setStatus('error');
      });
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    loadCounts();
    return () => {
      isMountedRef.current = false;
    };
  }, [loadCounts]);

  const retry = useCallback(() => {
    setStatus('loading');
    loadCounts();
  }, [loadCounts]);

  if (status === 'error') {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <ErrorState
          title="Couldn't load the dashboard"
          message="Something went wrong while fetching seller application counts."
          onRetry={retry}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-1 text-2xl font-semibold text-neutral-900 dark:text-neutral-50">Dashboard</h1>
      <p className="mb-10 text-sm text-neutral-500 dark:text-neutral-400">
        An overview of what needs your attention.
      </p>

      <div className="mb-3 flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-neutral-400 dark:text-neutral-500" strokeWidth={1.75} />
        <h2 className="text-sm font-semibold tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
          Seller Applications
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {APPLICATION_STAT_CARDS.map((card) => (
          <StatCard
            key={card.key}
            icon={card.icon}
            color={card.color}
            label={card.label}
            value={counts?.[card.key]}
            loading={status === 'loading'}
          />
        ))}
      </div>

      <div className="mt-8 mb-3 flex items-center gap-2">
        <h2 className="text-sm font-semibold tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
          Platform Activity
        </h2>
        <Badge variant="warning">Preview data</Badge>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {MOCK_STAT_CARDS.map((card) => (
          <StatCard
            key={card.key}
            icon={card.icon}
            color={card.color}
            label={card.label}
            value={card.value}
          />
        ))}
      </div>

      <div className="mt-8 mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-neutral-400 dark:text-neutral-500" strokeWidth={1.75} />
          <h2 className="text-sm font-semibold tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
            Recent Pending Applications
          </h2>
        </div>
        <Button as={NavLink} to={ROUTE_PATHS.ADMIN_SELLER_APPLICATIONS} size="sm">
          Review Queue
        </Button>
      </div>
      {status === 'loading' ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-14 rounded-lg" />
          ))}
        </div>
      ) : recentPending.length === 0 ? (
        <Card className="flex flex-col items-center gap-2 px-6 py-10 text-center">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">No pending applications.</p>
        </Card>
      ) : (
        <Table columns={RECENT_PENDING_COLUMNS} data={recentPending} />
      )}
    </div>
  );
}

export default AdminDashboardPage;
