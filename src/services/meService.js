import { ENDPOINTS } from './api/endpoints';
import { httpClient } from './api/httpClient';

// MyDetailsResponse: { id, fullName, email, emailVerified, gender, dateOfBirth,
// preferredLanguage, mobileNumber, alternateNumber, mobileVerified,
// otpLoginEnabled, addresses: [AddressResponse] }
export async function getMyDetails() {
  return httpClient.get(ENDPOINTS.ME.DETAILS);
}

export async function updatePersonalDetails(payload) {
  return httpClient.patch(ENDPOINTS.ME.PERSONAL_DETAILS, payload);
}

export async function updateContactDetails(payload) {
  return httpClient.patch(ENDPOINTS.ME.CONTACT_DETAILS, payload);
}

export async function updateSecurityPreference(payload) {
  return httpClient.patch(ENDPOINTS.ME.SECURITY, payload);
}

export async function listAddresses() {
  return httpClient.get(ENDPOINTS.ME.ADDRESSES);
}

// { type, recipientName, phone, addressLine1, addressLine2, city, state, pincode, defaultAddress }
export async function createAddress(address) {
  return httpClient.post(ENDPOINTS.ME.ADDRESSES, address);
}

export async function updateAddress(id, address) {
  return httpClient.put(ENDPOINTS.ME.ADDRESS_DETAIL(id), address);
}

export async function deleteAddress(id) {
  return httpClient.delete(ENDPOINTS.ME.ADDRESS_DETAIL(id));
}
