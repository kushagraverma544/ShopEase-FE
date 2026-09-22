// Tabs for the Admin > Seller Applications list — PENDING is the default
// view per the admin spec (it's the one with actionable work on it).
export const APPLICATION_STATUS_TABS = [
  { value: 'PENDING', label: 'Pending', badgeVariant: 'warning' },
  { value: 'HOLD', label: 'On Hold', badgeVariant: 'warning' },
  { value: 'APPROVED', label: 'Approved', badgeVariant: 'success' },
  { value: 'REJECTED', label: 'Rejected', badgeVariant: 'danger' },
];
