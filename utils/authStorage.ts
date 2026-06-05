import type { Page } from '@playwright/test';
import type { UserCredentials } from './testData';

type StoredUser = {
  id: string;
  username: string;
  email: string;
  password: string;
  createdAt: string;
};

const usersStorageKey = 'users:v1';

export async function seedRegisteredUser(page: Page, credentials: UserCredentials): Promise<void> {
  await page.addInitScript(
    ({ user, storageKey }) => {
      const existingUsers = JSON.parse(window.localStorage.getItem(storageKey) ?? '[]') as StoredUser[];
      const userAlreadyExists = existingUsers.some(
        existingUser => existingUser.username.toLowerCase() === user.username.toLowerCase()
      );

      if (!userAlreadyExists) {
        existingUsers.push(user);
        window.localStorage.setItem(storageKey, JSON.stringify(existingUsers));
      }
    },
    {
      storageKey: usersStorageKey,
      user: {
        id: `seeded-${credentials.username}`,
        username: credentials.username,
        email: credentials.email ?? `${credentials.username}@example.com`,
        password: credentials.password,
        createdAt: new Date().toISOString()
      } satisfies StoredUser
    }
  );
}
