import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const TOTAL_CODES = 20000;
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const SECRET = process.env.AUTH_SECRET || 'CITY_SOUL_BINDING_SECRET_2026_FRONTEND';
const OUTPUT_FILE = path.resolve(process.cwd(), 'codes.csv');

function randomPayload(length = 4) {
  const bytes = crypto.randomBytes(length);
  let result = '';
  for (let i = 0; i < length; i += 1) {
    result += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return result;
}

function toBase32(buffer, charCount = 4) {
  let bits = 0;
  let value = 0;
  let output = '';

  for (const byte of buffer) {
    value = (value << 8) | byte;
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

function signatureForPayload(payload, secret = SECRET) {
  const hmac = crypto.createHmac('sha256', secret).update(payload).digest();
  return toBase32(hmac, 4);
}

function generateCodes(total = TOTAL_CODES) {
  const usedPayloads = new Set();
  const rows = [];

  while (rows.length < total) {
    const payload = randomPayload(4);
    if (usedPayloads.has(payload)) {
      continue;
    }
    usedPayloads.add(payload);

    const signature = signatureForPayload(payload);
    rows.push({
      index: rows.length + 1,
      payload,
      signature,
      code: `${payload}-${signature}`
    });
  }

  return rows;
}

function toCsv(rows) {
  const header = ['index', 'payload', 'signature', 'code'];
  const lines = [header.join(',')];

  rows.forEach((row) => {
    lines.push([row.index, row.payload, row.signature, row.code].join(','));
  });

  return `${lines.join('\n')}\n`;
}

const codes = generateCodes();
const csv = toCsv(codes);
fs.writeFileSync(OUTPUT_FILE, csv, 'utf8');

console.log(`Generated ${codes.length} codes to ${OUTPUT_FILE}`);
console.log(`Secret used: ${SECRET}`);
