// Coarse "Today / Yesterday / Xd ago" label — good enough for dashboard
// widgets; switches to a plain date past a week so it doesn't read as stale math.
export function formatRelativeDate(iso) {
  const then = new Date(iso);
  const days = Math.floor((Date.now() - then.getTime()) / (1000 * 60 * 60 * 24));

  if (days <= 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return then.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}
