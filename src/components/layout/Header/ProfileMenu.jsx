import { User } from 'lucide-react';
import { NavLink } from 'react-router-dom';

import { Button } from '../../../components/common/Button/Button';
import { IconButton } from '../../../components/common/IconButton/IconButton';
import { ROUTE_PATHS } from '../../../routes/routePaths';

export function ProfileMenu({ currentUser }) {
  return (
    <div className="group relative">
      <IconButton icon={User} label={currentUser ? currentUser.name : 'Account'} />

      <div className="invisible absolute right-0 top-full z-10 pt-2 opacity-0 transition-opacity duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
        <div className="w-44 rounded-md border border-neutral-100 bg-neutral-0 p-2 shadow-drawer">
          {currentUser ? (
            <NavLink
              to={ROUTE_PATHS.ACCOUNT}
              className="flex h-10 items-center rounded-md px-3 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
            >
              My Account
            </NavLink>
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
