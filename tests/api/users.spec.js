import { expect, test } from '../../src/fixtures/reqres.fixture.js';

test('lists users for page 2 with pagination and user contract', async ({ usersClient }) => {
  const response = await usersClient.list(2);

  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body).toEqual(
    expect.objectContaining({
      page: 2,
      per_page: 6,
      total: 12,
      total_pages: 2,
    }),
  );
  expect(Array.isArray(body.data)).toBe(true);
  expect(body.data).toHaveLength(6);

  for (const user of body.data) {
    expect(user).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        email: expect.any(String),
        first_name: expect.any(String),
        last_name: expect.any(String),
        avatar: expect.any(String),
      }),
    );
  }
});
