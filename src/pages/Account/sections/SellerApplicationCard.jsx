import { AlertTriangle, Briefcase, Building2, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

import { Badge } from '../../../components/common/Badge/Badge';
import { Button } from '../../../components/common/Button/Button';
import { Card } from '../../../components/common/Card/Card';
import { ROUTE_PATHS } from '../../../routes/routePaths';
import { getSellerProfile } from '../../../services/sellerApplicationService';
import { cn } from '../../../utils/cn';

// Matches the gradient buttons already used on the admin side (see
// SellerApplicationDetailModal) rather than a flat fill, so this reads as
// the same "needs a decision" visual language across the app.
const URGENT_BUTTON_CLASSNAME =
  'border-transparent bg-gradient-to-b from-warning-500 to-warning-600 text-neutral-0 hover:brightness-110 active:brightness-95';

const STATUS_CONTENT = {
  NONE: {
    icon: Briefcase,
    iconClassName: 'text-primary-600',
    text: 'Start selling on ShopEase — tell us a bit about your business to get started.',
    cta: 'Become a Seller',
  },
  PENDING: {
    icon: Clock,
    iconClassName: 'text-warning-600',
    badge: { variant: 'warning', label: 'Under Review' },
    text: "Your application is under review. We'll notify you once it's reviewed.",
    cta: 'View Application',
  },
  HOLD: {
    icon: AlertTriangle,
    iconClassName: 'text-warning-600',
    badge: { variant: 'warning', label: 'Action Needed' },
    text: 'Your application needs a correction before it can be approved.',
    cta: 'Fix & Resubmit',
    urgent: true,
  },
  REJECTED: {
    icon: XCircle,
    iconClassName: 'text-danger-600',
    badge: { variant: 'danger', label: 'Rejected' },
    text: 'Your last application was rejected. You can review the reason and re-apply.',
    cta: 'View Application',
  },
  APPROVED: {
    icon: CheckCircle2,
    iconClassName: 'text-success-600',
    badge: { variant: 'success', label: 'Approved' },
    text: "You're approved! Log in again to access your Seller Dashboard.",
    cta: 'Continue',
  },
};

// Compact status teaser for /account — gated to non-sellers by the caller (a
// SELLER-role JWT never reaches this card). Status is fetched once on mount
// just to pick the right badge/copy; the actual form, review and revoke
// actions all live on the dedicated BecomeSellerPage this links to.
export function SellerApplicationCard() {
  const [status, setStatus] = useState('loading');

  const fetchStatus = useCallback(() => {
    return getSellerProfile()
      .then((data) => setStatus(data.status === 'REVOKED' ? 'NONE' : data.status))
      .catch(() => setStatus('NONE'));
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  if (status === 'loading') return null;

  const content = STATUS_CONTENT[status] ?? STATUS_CONTENT.NONE;
  const Icon = content.icon;

  return (
    <Card className={cn('p-6', content.urgent && 'border-l-4 border-l-warning-500')}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary-600" strokeWidth={1.75} />
          <h2 className="text-lg font-semibold text-neutral-900">Become a Seller</h2>
          {content.badge ? (
            <Badge
              variant={content.badge.variant}
              className={cn(content.urgent && 'relative animate-pulse')}
            >
              {content.badge.label}
            </Badge>
          ) : null}
        </div>
      </div>

      <div
        className={cn(
          'mt-5 flex items-start gap-3',
          content.urgent && 'rounded-lg bg-warning-50 p-4',
        )}
      >
        {content.urgent ? (
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-warning-100">
            <Icon className="h-4 w-4 text-warning-600" strokeWidth={2} />
          </span>
        ) : (
          <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${content.iconClassName}`} strokeWidth={1.75} />
        )}
        <p
          className={cn(
            'text-sm',
            content.urgent ? 'font-medium text-neutral-800' : 'text-neutral-600',
          )}
        >
          {content.text}
        </p>
      </div>

      <Button
        as={NavLink}
        to={ROUTE_PATHS.BECOME_SELLER}
        className={cn('mt-4', content.urgent && URGENT_BUTTON_CLASSNAME)}
      >
        {content.cta}
      </Button>
    </Card>
  );
}
