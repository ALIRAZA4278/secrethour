// Pakistani mobile numbers.
//
// PostEx wants 03XXXXXXXXX — 11 digits — so that is the canonical form every
// entry is reduced to. Checkout and the shipping integration share this file so
// a number that passes checkout is always one PostEx will accept.

export function normalizePkPhone(phone) {
  const digits = (phone || '').replace(/\D/g, '');
  if (digits.startsWith('92') && digits.length === 12) return '0' + digits.slice(2);
  if (digits.startsWith('3') && digits.length === 10) return '0' + digits;
  return digits.slice(0, 11);
}

// A complete mobile number, not a landline and not a half-typed one.
export function isValidPkMobile(phone) {
  return /^03\d{9}$/.test(normalizePkPhone(phone));
}

export const PK_PHONE_HINT = 'Enter a valid 11-digit mobile number, e.g. 0300 1234567.';
