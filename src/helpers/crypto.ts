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

export function decrypt(encrypted: string): string {
  const parts = encrypted.split(':');

  const iv = parts[0];
  const salt = parts[1];
  const data = parts[2];

  const _salt = Buffer.from(salt, 'hex');
  const _iv = Buffer.from(iv, 'hex');
  const _key = scryptSync(secret, _salt, 32);
  const decipher = createDecipheriv(algorithm, _key, _iv);
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(data, 'hex')),
    decipher.final(),
  ]);
  return decrypted.toString('utf8');
}
