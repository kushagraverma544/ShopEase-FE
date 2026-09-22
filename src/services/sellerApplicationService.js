import { ENDPOINTS } from './api/endpoints';
import { httpClient } from './api/httpClient';

// SellerApplicationStatusResponse (lightweight, for apply/status-poll use —
// no application yet is a 200 with status: 'NONE', not a 404):
// { status: 'NONE'|'PENDING'|'REJECTED'|'APPROVED', storeName, rejectionReason,
// appliedAt, reviewedAt }
// Superseded by getSellerProfile() below for both BecomeSellerPage and the
// /account teaser — kept only in case a future lightweight poll needs it.
export async function getSellerApplicationStatus() {
  return httpClient.get(ENDPOINTS.SELLER_APPLICATION.STATUS);
}

// SellerProfileResponse — the full record collected at application time, at
// any status. Shared verbatim with GET /admin/sellers and the admin
// approve/reject/hold responses. 404s only when the caller has never applied
// at all (no row exists) — treat that as status 'NONE' on the FE.
// status: 'PENDING' | 'HOLD' | 'APPROVED' | 'REJECTED' | 'REVOKED'.
// businessType is one of INDIVIDUAL/PROPRIETORSHIP/PARTNERSHIP/LLP/
// PRIVATE_LIMITED/PUBLIC_LIMITED (see constants/sellerBusinessTypes.constants.js).
// adminRemark (nullable) is shared by REJECTED and HOLD — same field, not two.
// correctionSubmittedAt (nullable timestamp) is set once the applicant has
// resubmitted while on HOLD. registrationNumber and pickupAddressLine2 are
// nullable; reviewedAt is null while status is PENDING.
export async function getSellerProfile() {
  return httpClient.get(ENDPOINTS.SELLER_APPLICATION.PROFILE);
}

// payload: { storeName, businessName, businessType, businessEmail, businessPhone,
// sellsOnlyBooks, registrationNumber (GSTIN, may be blank if sellsOnlyBooks),
// panNumber, bankAccountHolderName, bankAccountNumber, ifscCode,
// pickupAddress: { addressLine1, addressLine2, city, state, pincode },
// categories: string[], initialProduct: { name, brand, category, description,
// price, discountPercentage, stock, minimumOrderQuantity, sku, tags,
// weight, dimensions: { width, height, depth }, warrantyInformation,
// shippingInformation, returnPolicy } }
// -> lightweight { status, storeName, adminRemark, appliedAt, reviewedAt }
// (201 Created). BE branches on the caller's current application row: NONE/
// REJECTED/REVOKED creates a fresh one; HOLD updates the same row in place
// and stamps correctionSubmittedAt; PENDING/APPROVED instead 409s (message
// surfaced as-is via the caller's error banner).
//
// BE contract: always multipart/form-data, never a plain JSON POST — the
// payload above goes in a part named "data" with an explicit
// application/json content type (not a bare string field, which the
// browser would send as text/plain), and files (files.cancelledCheque,
// files.productImages) go in their own parts alongside it.
export async function applyForSeller(payload, files = {}) {
  const { cancelledCheque, productImages } = files;
  const formData = new FormData();
  formData.append('data', new Blob([JSON.stringify(payload)], { type: 'application/json' }));
  if (cancelledCheque) formData.append('cancelledCheque', cancelledCheque);
  (productImages ?? []).forEach((file) => formData.append('productImages', file));
  return httpClient.post(ENDPOINTS.SELLER_APPLICATION.APPLY, formData, {
    // Must NOT be set explicitly — axios/the browser needs to generate the
    // multipart boundary itself. Setting a bare 'multipart/form-data' (no
    // boundary) here would stick (overriding httpClient's default
    // 'application/json' instance header) and produce an unparseable body.
    headers: { 'Content-Type': undefined },
  });
}

// SellerApplicationHistoryEntry[] for the caller's own application, oldest
// first — same shape as GET /admin/sellers/{id}/history (see adminService.js):
// { fromStatus: string|null, toStatus, actor: 'SELLER'|'ADMIN', remark: string|null,
// occurredAt }. fromStatus is null on the very first entry (initial submit).
export async function getMySellerApplicationHistory() {
  return httpClient.get(ENDPOINTS.SELLER_APPLICATION.HISTORY);
}

// Withdraws a PENDING/HOLD application. Returns the full, updated
// SellerProfileResponse with status: 'REVOKED' (200) — not an empty body.
// 409s if the application isn't in a revocable state. The FE treats REVOKED
// the same as NONE (an empty apply form), so callers don't need anything
// from the response body beyond knowing the call succeeded.
export async function revokeSellerApplication() {
  return httpClient.delete(ENDPOINTS.SELLER_APPLICATION.APPLY);
}
