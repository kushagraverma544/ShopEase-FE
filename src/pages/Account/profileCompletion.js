// A newly registered user only has a username/password — everything here
// gets filled in on this page, so the header uses this to show how much of
// that is done. email is excluded (always present via Keycloak, so it would
// trivially inflate the score) and otpLoginEnabled is excluded (false is a
// valid choice, not an incomplete field).
const CHECKS = [
  { label: 'Full name', test: (details) => Boolean(details.fullName) },
  { label: 'Gender', test: (details) => Boolean(details.gender) },
  { label: 'Date of birth', test: (details) => Boolean(details.dateOfBirth) },
  { label: 'Preferred language', test: (details) => Boolean(details.preferredLanguage) },
  { label: 'Mobile number', test: (details) => Boolean(details.mobileNumber) },
  { label: 'Alternate number', test: (details) => Boolean(details.alternateNumber) },
  { label: 'A saved address', test: (details) => (details.addresses?.length ?? 0) > 0 },
];

export function getProfileCompletion(details) {
  const missing = CHECKS.filter((check) => !check.test(details));
  const completedCount = CHECKS.length - missing.length;

  return {
    percent: Math.round((completedCount / CHECKS.length) * 100),
    completedCount,
    totalCount: CHECKS.length,
    missingLabels: missing.map((check) => check.label),
  };
}
