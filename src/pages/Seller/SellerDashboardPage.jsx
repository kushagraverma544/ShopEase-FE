import { useCallback, useEffect, useRef, useState } from 'react';

import { Badge } from '../../components/common/Badge/Badge';
import { Card } from '../../components/common/Card/Card';
import { ErrorState } from '../../components/common/ErrorState/ErrorState';
import { Skeleton } from '../../components/common/Skeleton/Skeleton';
import { getSellerStats } from '../../services/sellerService';

const STAT_CARDS = [
  { key: 'totalListings', label: 'Total Listings' },
  { key: 'activeListings', label: 'Active Listings' },
  { key: 'ordersReceived', label: 'Orders Received' },
  { key: 'revenue', label: 'Revenue', format: (value) => `₹${value.toLocaleString('en-IN')}` },
];

export function SellerDashboardPage() {
  const [stats, setStats] = useState(null);
  const [status, setStatus] = useState('loading');
  const isMountedRef = useRef(false);

  const loadStats = useCallback(() => {
    getSellerStats()
      .then((data) => {
        if (isMountedRef.current) {
          setStats(data);
          setStatus('success');
        }
      })
      .catch(() => {
        if (isMountedRef.current) setStatus('error');
      });
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    loadStats();
    return () => {
      isMountedRef.current = false;
    };
  }, [loadStats]);

  const retryStats = useCallback(() => {
    setStatus('loading');
    loadStats();
  }, [loadStats]);

  if (status === 'loading') {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Skeleton className="mb-6 h-8 w-48" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STAT_CARDS.map((stat) => (
            <Skeleton key={stat.key} className="h-24 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <ErrorState
          title="Couldn't load your dashboard"
          message="Something went wrong while fetching your seller stats."
          onRetry={retryStats}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center gap-3">
        <h1 className="text-2xl font-semibold text-neutral-900">Seller Dashboard</h1>
        <Badge variant="warning">Preview data</Badge>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STAT_CARDS.map((stat) => (
          <Card key={stat.key} className="px-5 py-4">
            <p className="text-sm font-medium text-neutral-500">{stat.label}</p>
            <p className="mt-1 text-2xl font-semibold text-neutral-900">
              {stat.format ? stat.format(stats[stat.key]) : stats[stat.key]}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default SellerDashboardPage;
