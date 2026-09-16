export function formatInr(value) {
  return `₹${value.toLocaleString('en-IN')}`;
}

// Compact form for axis ticks / tight spaces — 12000 -> ₹12K, 1250000 -> ₹12.5L.
export function formatInrCompact(value) {
  if (value >= 100000) {
    const lakhs = value / 100000;
    return `₹${lakhs % 1 === 0 ? lakhs : lakhs.toFixed(1)}L`;
  }
  if (value >= 1000) {
    const thousands = value / 1000;
    return `₹${thousands % 1 === 0 ? thousands : thousands.toFixed(1)}K`;
  }
  return formatInr(value);
}
