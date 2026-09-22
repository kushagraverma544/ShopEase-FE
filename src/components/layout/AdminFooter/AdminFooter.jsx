// Minimal, admin-appropriate footer — the customer-facing Footer (common/
// Footer) carries storefront marketing copy that doesn't belong in an
// internal console, so this stays a separate, much lighter component.
export function AdminFooter() {
  return (
    <footer className="border-t border-neutral-100 bg-neutral-0 px-4 py-4 dark:border-neutral-700 dark:bg-neutral-800 sm:px-8">
      <p className="text-xs text-neutral-400 dark:text-neutral-500">
        &copy; {new Date().getFullYear()} ShopEase Admin Console
      </p>
    </footer>
  );
}
