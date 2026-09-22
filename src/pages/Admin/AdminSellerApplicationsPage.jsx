import { RotateCcw } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Badge } from '../../components/common/Badge/Badge';
import { Card } from '../../components/common/Card/Card';
import { ErrorState } from '../../components/common/ErrorState/ErrorState';
import { Skeleton } from '../../components/common/Skeleton/Skeleton';
import { Table } from '../../components/common/Table/Table';
import { APPLICATION_STATUS_TABS } from '../../constants/adminSellerApplications.constants';
import { getBusinessTypeLabel } from '../../constants/sellerBusinessTypes.constants';
import { getSellerApplications } from '../../services/adminService';
import { cn } from '../../utils/cn';
import { formatRelativeDate } from '../../utils/formatRelativeDate';
import { SellerApplicationDetailModal } from './sections/SellerApplicationDetailModal';

const COLUMNS = [
  {
    key: 'store',
    header: 'Store',
    render: (application) => (
      <div>
        <div className="flex items-center gap-2">
          <p className="font-medium text-neutral-900 dark:text-neutral-50">
            {application.storeName}
          </p>
          {application.correctionSubmittedAt ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700 dark:bg-primary-500/15 dark:text-primary-300">
              <RotateCcw className="h-3 w-3" strokeWidth={2} />
              Resubmitted
            </span>
          ) : null}
        </div>
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
    render: (application) => (
      <span className="text-neutral-500 dark:text-neutral-400">
        {formatRelativeDate(application.appliedAt)}
      </span>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    render: (application) => {
      const tab = APPLICATION_STATUS_TABS.find((item) => item.value === application.status);
      return (
        <Badge variant={tab?.badgeVariant ?? 'neutral'}>{tab?.label ?? application.status}</Badge>
      );
    },
  },
];

// Module 1 of the admin spec — the only module with a real backend today.
// Modules 2/3 (Customers, Analytics) are reserved as disabled AdminSidebar
// entries only (see nav.constants.js), nothing to build here for them yet.
export function AdminSellerApplicationsPage() {
  const [status, setStatus] = useState('PENDING');
  const [applications, setApplications] = useState([]);
  const [fetchStatus, setFetchStatus] = useState('loading');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const isMountedRef = useRef(false);

  const loadApplications = useCallback((forStatus) => {
    return getSellerApplications(forStatus)
      .then((data) => {
        if (isMountedRef.current) {
          setApplications(data);
          setFetchStatus('success');
        }
      })
      .catch(() => {
        if (isMountedRef.current) setFetchStatus('error');
      });
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    loadApplications(status);
    return () => {
      isMountedRef.current = false;
    };
  }, [status, loadApplications]);

  function selectTab(nextStatus) {
    if (nextStatus === status) return;
    setFetchStatus('loading');
    setStatus(nextStatus);
  }

  function retry() {
    setFetchStatus('loading');
    loadApplications(status);
  }

  function handleUpdated(updated) {
    setApplications((current) => current.filter((application) => application.id !== updated.id));
    setSelectedApplication(null);
  }

  // Swaps the list for the detail view in place, both still inside
  // AdminLayout's own content area (to the right of AdminSidebar, below
  // AdminHeader) — not an overlay, so the console chrome stays visible.
  if (selectedApplication) {
    return (
      <SellerApplicationDetailModal
        application={selectedApplication}
        onClose={() => setSelectedApplication(null)}
        onUpdated={handleUpdated}
      />
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-semibold text-neutral-900 dark:text-neutral-50">
        Seller Applications
      </h1>

      <div className="mb-6 flex gap-2 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800">
        {APPLICATION_STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => selectTab(tab.value)}
            className={cn(
              'flex-1 rounded-md py-2 text-sm font-medium transition-colors duration-150',
              status === tab.value
                ? 'bg-neutral-0 text-primary-600 shadow-card dark:bg-neutral-700 dark:text-primary-400'
                : 'text-neutral-500 dark:text-neutral-400',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {fetchStatus === 'loading' ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-14 rounded-lg" />
          ))}
        </div>
      ) : fetchStatus === 'error' ? (
        <ErrorState
          title="Couldn't load applications"
          message="Something went wrong while fetching seller applications."
          onRetry={retry}
        />
      ) : applications.length === 0 ? (
        <Card className="flex flex-col items-center gap-2 px-6 py-14 text-center">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">No applications.</p>
        </Card>
      ) : (
        <Table columns={COLUMNS} data={applications} onRowClick={setSelectedApplication} />
      )}
    </div>
  );
}

export default AdminSellerApplicationsPage;
