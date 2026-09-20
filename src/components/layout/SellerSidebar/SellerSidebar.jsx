import { Link, useLocation } from 'react-router-dom';

import { SELLER_SIDEBAR_NAV_ITEMS } from '../../../constants/nav.constants';
import {
  mobileDrawerClosed,
  selectMobileDrawerOpen,
  selectSidebarHovered,
  sidebarHoverEnded,
  sidebarHoverStarted,
} from '../../../features/ui/uiSlice';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { cn } from '../../../utils/cn';

function SellerSidebarNavLink({ to, icon: Icon, label, expanded, onNavigate, active }) {
  return (
    <Link
      to={to}
      onClick={onNavigate}
      className={cn(
        'mx-2 flex h-11 items-center gap-3 rounded-md px-3.5 text-sm font-medium text-neutral-600 hover:bg-primary-50 hover:text-primary-700 transition-colors duration-150',
        active && 'bg-primary-50 text-primary-700',
      )}
    >
      <Icon className="h-5 w-5 shrink-0" strokeWidth={1.75} />
      <span
        className={cn(
          'whitespace-nowrap transition-opacity duration-150',
          expanded ? 'opacity-100' : 'opacity-0',
        )}
      >
        {label}
      </span>
    </Link>
  );
}

// Static seller nav — unlike the customer Sidebar there's no dynamic
// category list to fetch, so no loading/error states are needed here.
export function SellerSidebar() {
  const dispatch = useAppDispatch();
  const expanded = useAppSelector(selectSidebarHovered);
  const mobileOpen = useAppSelector(selectMobileDrawerOpen);
  const location = useLocation();

  const showExpandedLabel = expanded || mobileOpen;
  const closeMobileDrawer = () => dispatch(mobileDrawerClosed());

  return (
    <>
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close menu"
          onClick={closeMobileDrawer}
          className="fixed inset-0 z-(--z-drawer-backdrop) bg-neutral-900/40 md:hidden"
        />
      ) : null}

      <aside
        onMouseEnter={() => dispatch(sidebarHoverStarted())}
        onMouseLeave={() => dispatch(sidebarHoverEnded())}
        className={cn(
          'fixed top-(--header-height) bottom-0 left-0 z-(--z-sidebar) flex flex-col overflow-hidden bg-neutral-0 py-3 shadow-drawer transition-[width,transform] duration-(--sidebar-transition-duration) ease-(--sidebar-transition-ease)',
          expanded ? 'w-(--sidebar-width-expanded)' : 'w-(--sidebar-width-collapsed)',
          mobileOpen
            ? 'translate-x-0 w-(--sidebar-width-expanded)'
            : '-translate-x-full md:translate-x-0',
        )}
      >
        <nav className="flex flex-col gap-1">
          {SELLER_SIDEBAR_NAV_ITEMS.map((item) => (
            <SellerSidebarNavLink
              key={item.id}
              to={item.path}
              icon={item.icon}
              label={item.label}
              expanded={showExpandedLabel}
              onNavigate={closeMobileDrawer}
              active={location.pathname === item.path}
            />
          ))}
        </nav>
      </aside>
    </>
  );
}
