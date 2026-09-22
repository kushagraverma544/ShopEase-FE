import { LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '../../../components/common/Button/Button';
import { Modal } from '../../../components/common/Modal/Modal';
import { Skeleton } from '../../../components/common/Skeleton/Skeleton';
import { useLogout } from '../../../features/auth/useLogout';
import { getMyDetails } from '../../../services/meService';
import { getRandomPhoto } from '../../../services/unsplashService';

// GET /me has no lastLogin/region fields today — shown as placeholders until
// the backend contract adds them, rather than leaving the rows out.
const MOCK_SESSION_INFO = {
  lastLogin: 'Today, 9:42 AM',
  region: 'Asia/Kolkata (IN)',
};

function InfoRow({ label, value }) {
  return (
    <div>
      <p className="text-xs text-neutral-400 dark:text-neutral-500">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-neutral-800 dark:text-neutral-100">{value || '—'}</p>
    </div>
  );
}

export function AdminProfileModal({ open, onClose }) {
  const handleLogout = useLogout();
  const [details, setDetails] = useState(null);
  const [status, setStatus] = useState('loading');
  const [avatarUrl, setAvatarUrl] = useState(null);

  // Resets to 'loading' the moment the modal (re)opens — computed during
  // render rather than inside the effect below (same "adjust state while
  // rendering" pattern ProductBrowser uses for its filter reset) so the
  // fetch effect itself never calls setState synchronously in its body.
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setStatus('loading');
  }

  useEffect(() => {
    if (!open) return undefined;
    let isMounted = true;
    getMyDetails()
      .then((data) => {
        if (isMounted) {
          setDetails(data);
          setStatus('success');
        }
      })
      .catch(() => {
        if (isMounted) setStatus('error');
      });
    return () => {
      isMounted = false;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    let isMounted = true;
    getRandomPhoto('admin portrait headshot')
      .then((photo) => {
        if (isMounted) setAvatarUrl(photo.urls.regular);
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, [open]);

  return (
    <Modal open={open} onClose={onClose} title="Profile" className="max-w-sm">
      <div className="flex flex-col items-center gap-3">
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full ring-4 ring-primary-50 dark:ring-primary-500/20">
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <Skeleton className="h-full w-full rounded-full" />
          )}
        </div>

        {status === 'loading' ? (
          <div className="flex w-full flex-col gap-2">
            <Skeleton className="mx-auto h-5 w-32" />
            <Skeleton className="mx-auto h-4 w-40" />
          </div>
        ) : status === 'error' ? (
          <p className="text-sm text-danger-600 dark:text-danger-400">Couldn't load your details.</p>
        ) : (
          <div className="text-center">
            <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-50">
              {details.fullName || 'Admin'}
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">{details.email}</p>
          </div>
        )}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 border-t border-neutral-100 pt-5 dark:border-neutral-700">
        <InfoRow label="Last Login" value={MOCK_SESSION_INFO.lastLogin} />
        <InfoRow label="Region" value={MOCK_SESSION_INFO.region} />
      </div>

      <Button variant="danger" fullWidth onClick={handleLogout} className="mt-6">
        <LogOut className="h-4 w-4" strokeWidth={1.75} />
        Logout
      </Button>
    </Modal>
  );
}
