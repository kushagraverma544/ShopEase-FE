import { NavLink } from 'react-router-dom';

import { SIDEBAR_NAV_ITEMS } from '../../../constants/nav.constants';
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

export function Sidebar() {
  const dispatch = useAppDispatch();
  const expanded = useAppSelector(selectSidebarHovered);
  const mobileOpen = useAppSelector(selectMobileDrawerOpen);

  return (
    <>
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => dispatch(mobileDrawerClosed())}
          className="fixed inset-0 z-(--z-drawer-backdrop) bg-neutral-900/40 md:hidden"
        />
      ) : null}

      <aside
        onMouseEnter={() => dispatch(sidebarHoverStarted())}
        onMouseLeave={() => dispatch(sidebarHoverEnded())}
        className={cn(
          'fixed top-(--header-height) bottom-0 left-0 z-(--z-sidebar) flex flex-col gap-1 overflow-x-hidden overflow-y-auto bg-neutral-0 py-3 shadow-drawer transition-[width,transform] duration-(--sidebar-transition-duration) ease-(--sidebar-transition-ease)',
          expanded ? 'w-(--sidebar-width-expanded)' : 'w-(--sidebar-width-collapsed)',
          mobileOpen
            ? 'translate-x-0 w-(--sidebar-width-expanded)'
            : '-translate-x-full md:translate-x-0',
        )}
      >
        {SIDEBAR_NAV_ITEMS.map(({ id, label, icon: Icon, path }) => (
          <NavLink
            key={id}
            to={path}
            onClick={() => dispatch(mobileDrawerClosed())}
            className={({ isActive }) =>
              cn(
                'mx-2 flex h-11 items-center gap-3 rounded-md px-3.5 text-sm font-medium text-neutral-600 hover:bg-primary-50 hover:text-primary-700 transition-colors duration-150',
                isActive && 'bg-primary-50 text-primary-700',
              )
            }
          >
            <Icon className="h-5 w-5 shrink-0" strokeWidth={1.75} />
            <span
              className={cn(
                'whitespace-nowrap transition-opacity duration-150',
                expanded || mobileOpen ? 'opacity-100' : 'opacity-0',
              )}
            >
              {label}
            </span>
          </NavLink>
        ))}
      </aside>
    </>
  );
}
