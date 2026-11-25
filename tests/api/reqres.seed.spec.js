import { test, expect } from '@playwright/test';

test('Reqres users endpoint is reachable', async ({ request }) => {
  const baseURL = process.env.REQRES_BASE_URL || process.env.API_BASE_URL || 'https://reqres.in/';
  const response = await request.get(new URL('/api/users?page=2', baseURL).toString());

  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  expect(body).toHaveProperty('page', 2);
  expect(Array.isArray(body.data)).toBeTruthy();
});
