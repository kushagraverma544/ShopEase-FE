import { ArrowLeftRight, Menu } from 'lucide-react';
import { NavLink } from 'react-router-dom';

import logo from '../../../assets/logo.png';
import { IconButton } from '../../../components/common/IconButton/IconButton';
import { selectCurrentUser } from '../../../features/auth/authSlice';
import { mobileDrawerToggled } from '../../../features/ui/uiSlice';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { ROUTE_PATHS } from '../../../routes/routePaths';
import { ProfileMenu } from '../Header/ProfileMenu';

export function SellerHeader() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);

  return (
    <header className="fixed inset-x-0 top-0 z-(--z-header) flex h-(--header-height) items-center gap-4 border-b border-neutral-100 bg-neutral-0 px-4 md:px-6">
      <IconButton
        icon={Menu}
        label="Toggle menu"
        className="md:hidden"
        onClick={() => dispatch(mobileDrawerToggled())}
      />

      <NavLink to={ROUTE_PATHS.SELLER_DASHBOARD} className="flex shrink-0 items-center gap-3">
        <img src={logo} alt="ShopEase" className="h-[3.75rem] w-auto" />
        <span className="hidden text-sm font-semibold tracking-wide text-neutral-500 sm:inline">
          Seller Console
        </span>
      </NavLink>

      <div className="ml-auto flex items-center gap-2 md:gap-4">
        <NavLink
          to={ROUTE_PATHS.HOME}
          className="flex h-10 items-center gap-2 rounded-md px-3 text-sm font-medium text-neutral-600 transition-colors duration-150 hover:bg-neutral-100 hover:text-neutral-900"
        >
          <ArrowLeftRight className="h-4 w-4" strokeWidth={1.75} />
          <span className="hidden sm:inline">Back to Store</span>
        </NavLink>

        <ProfileMenu currentUser={currentUser} />
      </div>
    </header>
  );
}
