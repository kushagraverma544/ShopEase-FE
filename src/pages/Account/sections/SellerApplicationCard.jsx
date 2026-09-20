import { Briefcase, Building2, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

import { Badge } from '../../../components/common/Badge/Badge';
import { Button } from '../../../components/common/Button/Button';
import { Card } from '../../../components/common/Card/Card';
import { ROUTE_PATHS } from '../../../routes/routePaths';
import { getSellerApplicationStatus } from '../../../services/sellerApplicationService';

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
    return getSellerApplicationStatus()
      .then((data) => setStatus(data.status))
      .catch(() => setStatus('NONE'));
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  if (status === 'loading') return null;

  const content = STATUS_CONTENT[status] ?? STATUS_CONTENT.NONE;
  const Icon = content.icon;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary-600" strokeWidth={1.75} />
          <h2 className="text-lg font-semibold text-neutral-900">Become a Seller</h2>
          {content.badge ? <Badge variant={content.badge.variant}>{content.badge.label}</Badge> : null}
        </div>
      </div>

      <div className="mt-5 flex items-start gap-3">
        <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${content.iconClassName}`} strokeWidth={1.75} />
        <p className="text-sm text-neutral-600">{content.text}</p>
      </div>

      <Button as={NavLink} to={ROUTE_PATHS.BECOME_SELLER} className="mt-4">
        {content.cta}
      </Button>
    </Card>
  );
}
