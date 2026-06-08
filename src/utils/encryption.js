import crypto from 'crypto';
import config from '../config/index.js';

const ALGO = 'aes-256-gcm';
const IV_LEN = 12;
const TAG_LEN = 16;
const KEY = Buffer.from(config.ENCRYPTION_KEY || '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef', 'utf8').slice(0, 32); // 32 bytes for aes-256

if (KEY.length !== 32) {
  console.warn('WARNING: ENCRYPTION_KEY not 32 bytes — using dev fallback. Set a strong 32+ char key in .env for production.');
}

export function encrypt(plainText) {
  if (!plainText) return null;
  const iv = crypto.randomBytes(IV_LEN);
  const cipher = crypto.createCipheriv(ALGO, KEY, iv);
  const encrypted = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString('base64');
}

export function decrypt(cipherText) {
  if (!cipherText) return null;
  const data = Buffer.from(cipherText, 'base64');
  const iv = data.subarray(0, IV_LEN);
  const tag = data.subarray(IV_LEN, IV_LEN + TAG_LEN);
  const encrypted = data.subarray(IV_LEN + TAG_LEN);
  const decipher = crypto.createDecipheriv(ALGO, KEY, iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString('utf8');
}

export default { encrypt, decrypt };
