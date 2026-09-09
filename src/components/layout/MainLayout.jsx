import { Outlet } from 'react-router-dom';

import { Footer } from './Footer/Footer';
import { Header } from './Header/Header';
import { Sidebar } from './Sidebar/Sidebar';

export function MainLayout() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      <Sidebar />
      <main className="flex min-h-screen flex-col pt-(--header-height) ml-0 md:ml-(--sidebar-width-collapsed)">
        <div className="flex-1">
          <Outlet />
        </div>
        <Footer />
      </main>
    </div>
  );
}
