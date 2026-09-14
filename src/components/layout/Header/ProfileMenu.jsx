import { LogOut, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';

import { Button } from '../../../components/common/Button/Button';
import { useLogout } from '../../../features/auth/useLogout';
import { ROUTE_PATHS } from '../../../routes/routePaths';

export function ProfileMenu({ currentUser }) {
  const handleLogout = useLogout();

  return (
    <div className="group relative">
      <button
        type="button"
        aria-label={currentUser ? undefined : 'Account'}
        className="flex h-10 items-center gap-2 rounded-full pl-2 pr-3 text-neutral-600 transition-colors duration-150 hover:bg-neutral-100 hover:text-neutral-900"
      >
        <User className="h-5 w-5 shrink-0" strokeWidth={1.75} />
        {currentUser ? (
          <span className="hidden max-w-[8rem] truncate text-sm font-medium text-neutral-800 sm:inline">
            {currentUser.fullName || currentUser.username}
          </span>
        ) : null}
      </button>

      <div className="hidden absolute right-0 top-full z-10 pt-2 group-hover:block group-focus-within:block">
        <div className="w-44 rounded-md border border-neutral-100 bg-neutral-0 p-2 shadow-drawer">
          {currentUser ? (
            <>
              <NavLink
                to={ROUTE_PATHS.ACCOUNT}
                className="flex h-10 items-center rounded-md px-3 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
              >
                My Account
              </NavLink>
              <NavLink
                to={ROUTE_PATHS.ORDERS}
                className="flex h-10 items-center rounded-md px-3 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
              >
                My Orders
              </NavLink>
              <div className="my-1 border-t border-neutral-100" />
              <button
                type="button"
                onClick={handleLogout}
                className="flex h-10 w-full items-center gap-2 rounded-md px-3 text-sm font-medium text-danger-600 hover:bg-danger-50"
              >
                <LogOut className="h-4 w-4" strokeWidth={1.75} />
                Logout
              </button>
            </>
          ) : (
            <Button as={NavLink} to={ROUTE_PATHS.LOGIN} size="sm" fullWidth>
              Login
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
