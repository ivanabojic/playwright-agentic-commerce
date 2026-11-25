import { test as base } from '@playwright/test';
import { AuthClient } from '../api/clients/AuthClient.js';
import { UsersClient } from '../api/clients/UsersClient.js';
import { ResourceClient } from '../api/clients/ResourceClient.js';

export const test = base.extend({
  authClient: async ({ request }, use) => {
    await use(new AuthClient(request));
  },
  usersClient: async ({ request }, use) => {
    await use(new UsersClient(request));
  },
  resourceClient: async ({ request }, use) => {
    await use(new ResourceClient(request));
  },
});

export { expect } from '@playwright/test';
