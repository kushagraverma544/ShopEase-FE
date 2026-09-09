export function Footer() {
  return (
    <footer className="border-t border-neutral-100 bg-neutral-0 px-6 py-8 text-sm text-neutral-500">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 text-center">
        <span className="text-lg font-semibold text-primary-600">ShopEase</span>
        <p>Everything you need, delivered to your door.</p>
        <p>&copy; {new Date().getFullYear()} ShopEase. All rights reserved.</p>
      </div>
    </footer>
  );
}
