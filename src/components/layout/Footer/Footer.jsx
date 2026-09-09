import logo from '../../../assets/logo.png';

export function Footer() {
  return (
    <footer className="border-t border-neutral-100 bg-neutral-0">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-6">
        <img src={logo} alt="ShopEase" className="h-9 w-auto" />
        <p className="text-sm text-neutral-500">Everything you need, delivered to your door.</p>
        <p className="text-xs text-neutral-400">
          &copy; {new Date().getFullYear()} ShopEase. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
