import { ChevronRight, UserCircle } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import logo from '../../../assets/logo-dark.png';
import { Badge } from '../../../components/common/Badge/Badge';
import { ADMIN_SIDEBAR_NAV_GROUPS } from '../../../constants/nav.constants';
import { mobileDrawerClosed, selectMobileDrawerOpen } from '../../../features/ui/uiSlice';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { ROUTE_PATHS } from '../../../routes/routePaths';
import { cn } from '../../../utils/cn';
import { AdminProfileModal } from './AdminProfileModal';

const navLinkClasses =
  'mx-3 flex h-11 items-center gap-3 rounded-xl px-3.5 text-sm font-medium transition-colors duration-150';

// The sidebar's own bg is a fixed solid navy (not tied to the light/dark
// theme toggle — it's brand chrome, not content), so nav text stays a
// light/white palette here regardless of AdminHeader's theme.
const linkColorClasses = 'text-white/60 hover:bg-white/5 hover:text-white';
const activeLinkColorClasses = 'bg-blue-600 text-white shadow-card';

function AdminSidebarNavLink({ to, icon: Icon, label, onNavigate, active }) {
  return (
    <Link
      to={to}
      onClick={onNavigate}
      className={cn(navLinkClasses, active ? activeLinkColorClasses : linkColorClasses)}
    >
      <Icon className="h-5 w-5 shrink-0" strokeWidth={1.75} />
      <span className="flex flex-1 items-center justify-between whitespace-nowrap">{label}</span>
    </Link>
  );
}

// Modules 2 & 3 of the admin spec (Customers, Analytics) have no backend
// yet — rendered as a non-interactive row instead of a Link, so the future
// nav position is visible without pretending the page exists.
function AdminSidebarDisabledItem({ icon: Icon, label }) {
  return (
    <div className={cn(navLinkClasses, 'cursor-not-allowed text-white/30')}>
      <Icon className="h-5 w-5 shrink-0" strokeWidth={1.75} />
      <span className="flex flex-1 items-center justify-between whitespace-nowrap">
        {label}
        <Badge variant="neutral">Soon</Badge>
      </span>
    </div>
  );
}

// Unlike Sidebar/SellerSidebar, this one is always open on desktop (no
// hover-to-expand/collapse), spans the full viewport height, and carries the
// app logo at its own top instead of AdminHeader — a fixed solid navy runs
// the whole way from that logo down to the Profile row.
export function AdminSidebar() {
  const dispatch = useAppDispatch();
  const mobileOpen = useAppSelector(selectMobileDrawerOpen);
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);

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
        className={cn(
          'fixed top-0 bottom-0 left-0 z-(--z-sidebar) flex w-(--sidebar-width-expanded) flex-col overflow-hidden bg-gradient-to-b from-blue-600 from-0% via-navy-800 via-20% to-navy-900 to-50% shadow-drawer transition-transform duration-(--sidebar-transition-duration) ease-(--sidebar-transition-ease)',
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        )}
      >
        <Link
          to={ROUTE_PATHS.ADMIN_DASHBOARD}
          onClick={closeMobileDrawer}
          className="flex h-(--header-height) shrink-0 items-center border-b border-white/10 px-4"
        >
          <img src={logo} alt="ShopEase" className="h-auto w-40" />
        </Link>

        <nav className="flex-1 overflow-y-auto py-3">
          {ADMIN_SIDEBAR_NAV_GROUPS.map((group, index) => (
            <div key={group.id} className={cn('flex flex-col gap-1', index > 0 && 'mt-4')}>
              <p className="mx-3 px-3.5 pb-1.5 text-2xs font-semibold tracking-wider text-white/35 uppercase">
                {group.label}
              </p>
              {group.items.map((item) =>
                item.disabled ? (
                  <AdminSidebarDisabledItem key={item.id} icon={item.icon} label={item.label} />
                ) : (
                  <AdminSidebarNavLink
                    key={item.id}
                    to={item.path}
                    icon={item.icon}
                    label={item.label}
                    onNavigate={closeMobileDrawer}
                    active={location.pathname === item.path}
                  />
                ),
              )}
            </div>
          ))}
        </nav>

        <div className="mt-auto border-t border-white/10 p-3">
          <button
            type="button"
            onClick={() => setProfileOpen(true)}
            className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors duration-150 hover:bg-white/5"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-300">
              <UserCircle className="h-6 w-6" strokeWidth={1.75} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-white">Profile</span>
              <span className="block truncate text-xs text-white/50">Administrator</span>
            </span>
            <ChevronRight className="h-4 w-4 shrink-0 text-white/40" strokeWidth={1.75} />
          </button>
        </div>
      </aside>

      <AdminProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
    </>
  );
}
