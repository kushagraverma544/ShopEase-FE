import { ENDPOINTS } from './api/endpoints';
import { httpClient } from './api/httpClient';

// SellerApplicationStatusResponse (lightweight, for apply/status-poll use —
// no application yet is a 200 with status: 'NONE', not a 404):
// { status: 'NONE'|'PENDING'|'REJECTED'|'APPROVED', storeName, rejectionReason,
// appliedAt, reviewedAt }
export async function getSellerApplicationStatus() {
  return httpClient.get(ENDPOINTS.SELLER_APPLICATION.STATUS);
}

// SellerProfileResponse — the full record collected at application time,
// shared verbatim with GET /admin/sellers and the admin approve/reject
// responses. 404s if the caller has never applied (only relevant for a
// customer; a SELLER-role JWT always has one). businessType is one of
// INDIVIDUAL/PROPRIETORSHIP/PARTNERSHIP/LLP/PRIVATE_LIMITED/PUBLIC_LIMITED
// (see constants/sellerBusinessTypes.constants.js). registrationNumber,
// pickupAddressLine2 and rejectionReason are nullable; reviewedAt is null
// while status is PENDING.
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
// shippingInformation, returnPolicy } } -> SellerApplicationStatusResponse
//
// files ({ cancelledCheque, productImages }) are sent alongside as
// multipart/form-data when present (BE contract for these uploads is still
// TBD — sent as a "cancelledCheque" part and repeated "productImages" parts
// next to a JSON-stringified "application" part, the common shape for a
// file-plus-fields submit; align with BE once that part of the contract is
// confirmed).
export async function applyForSeller(payload, files = {}) {
  const { cancelledCheque, productImages } = files;
  if (cancelledCheque || productImages?.length) {
    const formData = new FormData();
    formData.append('application', JSON.stringify(payload));
    if (cancelledCheque) formData.append('cancelledCheque', cancelledCheque);
    (productImages ?? []).forEach((file) => formData.append('productImages', file));
    return httpClient.post(ENDPOINTS.SELLER_APPLICATION.APPLY, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }
  return httpClient.post(ENDPOINTS.SELLER_APPLICATION.APPLY, payload);
}

// Withdraws a PENDING/REJECTED application, resetting status back to NONE.
// Not in the original BE contract handoff — assumed DELETE on the same
// resource POST /seller/apply creates; confirm with BE once this ships.
export async function revokeSellerApplication() {
  return httpClient.delete(ENDPOINTS.SELLER_APPLICATION.APPLY);
}
