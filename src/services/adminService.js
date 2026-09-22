import { ENDPOINTS } from './api/endpoints';
import { httpClient } from './api/httpClient';

// SellerProfileResponse[] — same shape as GET /seller/profile (see
// sellerApplicationService.js), one array entry per applicant for the
// given status.
export async function getSellerApplications(status) {
  return httpClient.get(ENDPOINTS.ADMIN.SELLERS, { params: { status } });
}

// -> SellerProfileResponse with status: 'APPROVED', reviewedAt populated.
// Backend handles Keycloak role grant + product go-live as side effects.
export async function approveSellerApplication(id) {
  return httpClient.patch(ENDPOINTS.ADMIN.APPROVE(id));
}

// reason required, non-blank -> SellerProfileResponse with status: 'REJECTED'.
export async function rejectSellerApplication(id, reason) {
  return httpClient.patch(ENDPOINTS.ADMIN.REJECT(id), { reason });
}

// remark required, non-blank -> SellerProfileResponse with status: 'HOLD',
// reviewedAt populated. Only valid from PENDING (409 otherwise, e.g. already
// reviewed by another admin). The applicant sees `remark` as adminRemark and
// can correct + resubmit the same application without starting over.
export async function holdSellerApplication(id, remark) {
  return httpClient.patch(ENDPOINTS.ADMIN.HOLD(id), { remark });
}

// SellerApplicationHistoryEntry[], oldest first:
// { fromStatus: string|null, toStatus, actor: 'SELLER'|'ADMIN', remark: string|null,
// occurredAt }. fromStatus is null on the very first entry (initial submit).
export async function getSellerApplicationHistory(id) {
  return httpClient.get(ENDPOINTS.ADMIN.HISTORY(id));
}
