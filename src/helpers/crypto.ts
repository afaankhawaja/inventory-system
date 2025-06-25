import {
  randomBytes,
  scryptSync,
  createCipheriv,
  createDecipheriv,
} from 'crypto';

const algorithm = 'aes-256-cbc';
const secret = process.env.ENCRYPT_SECRET!;
const salt = randomBytes(16);
const key = scryptSync(secret, salt, 32);
const iv = randomBytes(16);

export function encrypt(plain: string) {
  const cipher = createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(plain, 'utf8'),
    cipher.final(),
  ]);
  return [
    iv.toString('hex'),
    salt.toString('hex'),
    encrypted.toString('hex'),
  ].join(':');
}

export function decrypt(enc: { iv: string; salt: string; data: string }) {
  const _salt = Buffer.from(enc.salt, 'hex');
  const _iv = Buffer.from(enc.iv, 'hex');
  const _key = scryptSync(secret, _salt, 32);
  const decipher = createDecipheriv(algorithm, _key, _iv);
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(enc.data, 'hex')),
    decipher.final(),
  ]);
  return decrypted.toString('utf8');
}
