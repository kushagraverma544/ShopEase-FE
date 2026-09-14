import { LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '../../../components/common/Button/Button';
import { Card } from '../../../components/common/Card/Card';
import { Skeleton } from '../../../components/common/Skeleton/Skeleton';
import { useLogout } from '../../../features/auth/useLogout';
import { getRandomPhoto } from '../../../services/unsplashService';

export function ProfileSidebar({ user }) {
  const handleLogout = useLogout();
  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    let isMounted = true;
    getRandomPhoto(user.avatarQuery)
      .then((photo) => {
        if (isMounted) setAvatarUrl(photo.urls.regular);
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, [user.avatarQuery]);

  return (
    <Card className="flex flex-col items-center gap-4 p-6 lg:sticky lg:top-[calc(var(--header-height)+1.5rem)]">
      <div className="h-28 w-28 shrink-0 overflow-hidden rounded-full ring-4 ring-primary-50">
        {avatarUrl ? (
          <img src={avatarUrl} alt={user.name} className="h-full w-full object-cover" />
        ) : (
          <Skeleton className="h-full w-full rounded-full" />
        )}
      </div>

      <div className="text-center">
        <h1 className="text-lg font-semibold text-neutral-900">{user.name}</h1>
        <p className="mt-1 text-xs text-neutral-400">Member since {user.memberSince}</p>
      </div>

      <div className="w-full border-t border-neutral-100 pt-4 text-center text-sm">
        <p className="truncate text-neutral-600">{user.contact.email}</p>
        <p className="mt-1 text-neutral-600">{user.contact.phone}</p>
      </div>

      <Button variant="danger" fullWidth onClick={handleLogout} className="mt-2">
        <LogOut className="h-4 w-4" strokeWidth={1.75} />
        Logout
      </Button>
    </Card>
  );
}
