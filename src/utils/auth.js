const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const AUTH_CODE_REGEX = /^[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}$/;
export const AUTH_SECRET =
  import.meta.env.VITE_AUTH_SECRET || 'CITY_SOUL_BINDING_SECRET_2026_FRONTEND';

function toBase32(bytes, charCount = 4) {
  let bits = 0;
  let value = 0;
  let output = '';

  for (let i = 0; i < bytes.length; i += 1) {
    value = (value << 8) | bytes[i];
    bits += 8;

    while (bits >= 5 && output.length < charCount) {
      output += ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }

    if (output.length >= charCount) {
      break;
    }
  }

  if (output.length < charCount && bits > 0) {
    output += ALPHABET[(value << (5 - bits)) & 31];
  }

  while (output.length < charCount) {
    output += ALPHABET[0];
  }

  return output.slice(0, charCount);
}

export function normalizeCode(code) {
  return (code || '').trim().replace(/\s+/g, '').toUpperCase();
}

export function isCodeFormatValid(code) {
  return AUTH_CODE_REGEX.test(normalizeCode(code));
}

async function hmacSha256(message, secret) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(message));
  return new Uint8Array(signature);
}

export async function getCodeSignature(payload, secret = AUTH_SECRET) {
  const digest = await hmacSha256(payload, secret);
  return toBase32(digest, 4);
}

export async function verifyAuthorizationCode(inputCode, secret = AUTH_SECRET) {
  const code = normalizeCode(inputCode);

  if (!isCodeFormatValid(code)) {
    return {
      valid: false,
      reason: 'format'
    };
  }

  const [payload, signature] = code.split('-');
  const expected = await getCodeSignature(payload, secret);

  return {
    valid: signature === expected,
    reason: signature === expected ? null : 'signature',
    payload,
    signature,
    expected,
    code
  };
}

export const AUTH_CODE_ALPHABET = ALPHABET;
export { AUTH_CODE_REGEX };
