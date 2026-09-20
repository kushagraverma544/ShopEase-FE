import { CheckCircle2, Package, ShoppingCart, Wallet } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Badge } from '../../components/common/Badge/Badge';
import { Card } from '../../components/common/Card/Card';
import { ErrorState } from '../../components/common/ErrorState/ErrorState';
import { Skeleton } from '../../components/common/Skeleton/Skeleton';
import {
  getLowStockProducts,
  getOrderStatusBreakdown,
  getRecentlyAddedProducts,
  getRecentOrders,
  getSalesTrend,
  getSellerStats,
  getTopSellingProducts,
} from '../../services/sellerService';
import { cn } from '../../utils/cn';
import { formatInr } from '../../utils/formatCurrency';
import { CHIP_STRIP_CLASSES } from './sections/chipColors';
import { IconChip } from './sections/SectionHeader';
import { LowStockAlertsCard } from './sections/LowStockAlertsCard';
import { OrderStatusBreakdownCard } from './sections/OrderStatusBreakdownCard';
import { RecentlyAddedListingsCard } from './sections/RecentlyAddedListingsCard';
import { RecentOrdersCard } from './sections/RecentOrdersCard';
import { SalesTrendCard } from './sections/SalesTrendCard';
import { TopSellingProductsCard } from './sections/TopSellingProductsCard';

const STAT_CARDS = [
  {
    key: 'totalListings',
    label: 'Total Listings',
    icon: Package,
    color: 'primary',
    description: (stats) => `${stats.activeListings} active`,
  },
  {
    key: 'activeListings',
    label: 'Active Listings',
    icon: CheckCircle2,
    color: 'accent',
    description: (stats) => `Out of ${stats.totalListings} total`,
  },
  {
    key: 'ordersReceived',
    label: 'Orders Received',
    icon: ShoppingCart,
    color: 'warning',
    description: () => 'Last 14 days',
  },
  {
    key: 'revenue',
    label: 'Revenue (this month)',
    icon: Wallet,
    color: 'success',
    format: formatInr,
    description: () => 'Non-cancelled orders',
  },
];

export function SellerDashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [status, setStatus] = useState('loading');
  const isMountedRef = useRef(false);

  const loadDashboard = useCallback(() => {
    Promise.all([
      getSellerStats(),
      getSalesTrend({ days: 14 }),
      getOrderStatusBreakdown(),
      getRecentOrders({ limit: 5 }),
      getTopSellingProducts({ limit: 5 }),
      getLowStockProducts({ threshold: 5 }),
      getRecentlyAddedProducts({ limit: 5 }),
    ])
      .then(([stats, salesTrend, orderStatus, recentOrders, topSelling, lowStock, recentlyAdded]) => {
        if (isMountedRef.current) {
          setDashboard({ stats, salesTrend, orderStatus, recentOrders, topSelling, lowStock, recentlyAdded });
          setStatus('success');
        }
      })
      .catch(() => {
        if (isMountedRef.current) setStatus('error');
      });
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    loadDashboard();
    return () => {
      isMountedRef.current = false;
    };
  }, [loadDashboard]);

  const retryDashboard = useCallback(() => {
    setStatus('loading');
    loadDashboard();
  }, [loadDashboard]);

  if (status === 'loading') {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Skeleton className="mb-6 h-8 w-48" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STAT_CARDS.map((stat) => (
            <Skeleton key={stat.key} className="h-24 rounded-lg" />
          ))}
        </div>
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Skeleton className="h-72 rounded-lg lg:col-span-2" />
          <Skeleton className="h-72 rounded-lg" />
        </div>
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Skeleton className="h-64 rounded-lg" />
          <Skeleton className="h-64 rounded-lg" />
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
          onRetry={retryDashboard}
        />
      </div>
    );
  }

  const { stats, salesTrend, orderStatus, recentOrders, topSelling, lowStock, recentlyAdded } = dashboard;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center gap-3">
        <h1 className="text-2xl font-semibold text-neutral-900">Seller Dashboard</h1>
        <Badge variant="warning">Preview data</Badge>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STAT_CARDS.map((stat) => (
          <Card key={stat.key} className="relative px-5 pt-5 pb-4">
            <span className={cn('absolute inset-x-0 top-0 h-1', CHIP_STRIP_CLASSES[stat.color])} />
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-neutral-500">{stat.label}</p>
                <p className="mt-1 text-3xl font-bold tabular-nums text-neutral-900">
                  {stat.format ? stat.format(stats[stat.key]) : stats[stat.key]}
                </p>
              </div>
              <IconChip icon={stat.icon} color={stat.color} variant="soft" size="lg" />
            </div>
            <p className="mt-3 text-sm text-neutral-400">{stat.description(stats)}</p>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SalesTrendCard data={salesTrend} />
        </div>
        <OrderStatusBreakdownCard data={orderStatus} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecentOrdersCard orders={recentOrders} />
        <LowStockAlertsCard products={lowStock} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TopSellingProductsCard products={topSelling} />
        <RecentlyAddedListingsCard products={recentlyAdded} />
      </div>
    </div>
  );
}

export default SellerDashboardPage;
