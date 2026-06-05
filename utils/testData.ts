import fs from 'node:fs';
import path from 'node:path';

export type UserCredentials = {
  username: string;
  email?: string;
  password: string;
};

export type ProductData = {
  name: string;
  sku: string;
  price: string;
  category: 'Electronics' | 'Books' | 'Clothing' | 'Home' | 'Other';
  inStock: boolean;
  description?: string;
};

const credentialsDirectory = path.resolve(process.cwd(), '.auth');
const registeredUserPath = path.join(credentialsDirectory, 'registered-user.json');

export const securePassword = process.env.SECURE_PASSWORD ?? 'SecurePass123!';

export const invalidUser: UserCredentials = {
  username: process.env.INVALID_USERNAME ?? 'wronguser',
  password: process.env.INVALID_PASSWORD ?? 'wrongpassword'
};

export const adminUser: UserCredentials = {
  username: process.env.VALID_USERNAME ?? 'admin',
  password: process.env.VALID_PASSWORD ?? 'admin123'
};

function isStoredUserCredentials(value: unknown): value is UserCredentials {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<Record<keyof UserCredentials, unknown>>;

  return (
    typeof candidate.username === 'string' &&
    typeof candidate.password === 'string' &&
    (candidate.email === undefined || typeof candidate.email === 'string')
  );
}

export function saveRegisteredUser(credentials: UserCredentials): void {
  fs.mkdirSync(credentialsDirectory, { recursive: true });
  const tempPath = `${registeredUserPath}.tmp`;

  fs.writeFileSync(tempPath, JSON.stringify(credentials, null, 2));
  fs.renameSync(tempPath, registeredUserPath);
}

export function getRegisteredUser(): UserCredentials | null {
  if (!fs.existsSync(registeredUserPath)) {
    return null;
  }

  try {
    const storedCredentials: unknown = JSON.parse(fs.readFileSync(registeredUserPath, 'utf-8'));

    if (isStoredUserCredentials(storedCredentials)) {
      return storedCredentials;
    }
  } catch {
    return null;
  }

  return null;
}
