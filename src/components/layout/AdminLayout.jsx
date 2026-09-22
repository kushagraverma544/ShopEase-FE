import { Outlet } from 'react-router-dom';

import { cn } from '../../utils/cn';
import { AdminFooter } from './AdminFooter/AdminFooter';
import { AdminHeader } from './AdminHeader/AdminHeader';
import { AdminSidebar } from './AdminSidebar/AdminSidebar';
import { useAdminTheme } from './useAdminTheme';

// AdminSidebar is always open (not hover-collapsible like Seller's), so the
// content area is offset by the expanded sidebar width, not the collapsed
// one — and a footer closes out the content column, per the admin layout:
// header on top; sidebar + content area below it; footer under the content.
//
// The `dark` class lives here (not on <html>) — it's an admin-only
// preference, applying it at the root would also flip the customer/seller
// storefront, which has no dark: styling and no toggle of its own.
export function AdminLayout() {
  const [theme, toggleTheme] = useAdminTheme();

  return (
    <div className={cn('min-h-screen bg-neutral-50 dark:bg-neutral-900', theme === 'dark' && 'dark')}>
      <AdminHeader theme={theme} onToggleTheme={toggleTheme} />
      <AdminSidebar />
      <main className="flex min-h-screen flex-col pt-(--header-height) ml-0 md:ml-(--sidebar-width-expanded)">
        <div className="flex-1">
          <Outlet />
        </div>
        <AdminFooter />
      </main>
    </div>
  );
}
