// Matches the businessType enum on SellerProfileResponse (BE contract for
// POST /seller/apply, GET /seller/profile, GET /admin/sellers) exactly —
// don't add/rename values here without checking with BE first.
export const BUSINESS_TYPES = [
  { value: 'INDIVIDUAL', label: 'Individual' },
  { value: 'PROPRIETORSHIP', label: 'Proprietorship' },
  { value: 'PARTNERSHIP', label: 'Partnership' },
  { value: 'LLP', label: 'LLP' },
  { value: 'PRIVATE_LIMITED', label: 'Private Limited Company' },
  { value: 'PUBLIC_LIMITED', label: 'Public Limited Company' },
];

export function getBusinessTypeLabel(value) {
  return BUSINESS_TYPES.find((type) => type.value === value)?.label ?? value;
}
