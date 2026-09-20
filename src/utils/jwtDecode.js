// Decodes the payload of a JWT without verifying its signature — fine for
// reading claims client-side (role-based routing/UI), never for a decision
// that needs real trust (that belongs server-side, where the signature is
// actually checked).
export function decodeJwt(token) {
  if (!token) return null;

  try {
    const payload = token.split('.')[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((char) => '%' + char.charCodeAt(0).toString(16).padStart(2, '0'))
        .join(''),
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}
