import { Outlet } from 'react-router-dom';

import { SellerHeader } from './SellerHeader/SellerHeader';
import { SellerSidebar } from './SellerSidebar/SellerSidebar';

export function SellerLayout() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <SellerHeader />
      <SellerSidebar />
      <main className="flex min-h-screen flex-col pt-(--header-height) ml-0 md:ml-(--sidebar-width-collapsed)">
        <div className="flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
