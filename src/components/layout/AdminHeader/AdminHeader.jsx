import { ArrowLeftRight, Menu, Moon, Sun } from 'lucide-react';
import { NavLink } from 'react-router-dom';

import { IconButton } from '../../../components/common/IconButton/IconButton';
import { mobileDrawerToggled } from '../../../features/ui/uiSlice';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { ROUTE_PATHS } from '../../../routes/routePaths';

// No logo/title here — that now lives at the top of AdminSidebar instead
// (see AdminSidebar.jsx), which spans the full viewport height. No
// ProfileMenu either — unlike SellerHeader, the Admin's profile popup lives
// at the bottom of AdminSidebar (see AdminSidebar/AdminProfileModal), since
// the admin console has no header-reachable account page of its own.
export function AdminHeader({ onToggleTheme, theme }) {
  const dispatch = useAppDispatch();

  return (
    <header className="fixed inset-x-0 top-0 z-(--z-header) flex h-(--header-height) items-center gap-4 border-b border-neutral-100 bg-neutral-0 px-4 dark:border-neutral-700 dark:bg-neutral-800 md:left-(--sidebar-width-expanded) md:px-6">
      <IconButton
        icon={Menu}
        label="Toggle menu"
        className="md:hidden"
        onClick={() => dispatch(mobileDrawerToggled())}
      />

      <div className="ml-auto flex items-center gap-2 md:gap-4">
        <NavLink
          to={ROUTE_PATHS.HOME}
          className="flex h-10 items-center gap-2 rounded-md px-3 text-sm font-medium text-neutral-600 transition-colors duration-150 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:hover:text-neutral-50"
        >
          <ArrowLeftRight className="h-4 w-4" strokeWidth={1.75} />
          <span className="hidden sm:inline">Back to Store</span>
        </NavLink>

        <IconButton
          icon={theme === 'dark' ? Sun : Moon}
          label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          tooltip
          onClick={onToggleTheme}
        />
      </div>
    </header>
  );
}
