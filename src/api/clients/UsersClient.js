export class UsersClient {
  constructor(
    request,
    baseURL = process.env.REQRES_BASE_URL || process.env.API_BASE_URL || 'https://reqres.in/',
  ) {
    this.request = request;
    this.baseURL = baseURL;
  }

  list(page = 1) {
    const url = new URL('/api/users', this.baseURL);
    url.searchParams.set('page', String(page));
    return this.request.get(url.toString());
  }

  getById(id) {
    return this.request.get(new URL(`/api/users/${id}`, this.baseURL).toString());
  }

  create(data) {
    return this.request.post(new URL('/api/users', this.baseURL).toString(), { data });
  }

  update(id, data) {
    return this.request.put(new URL(`/api/users/${id}`, this.baseURL).toString(), { data });
  }

  patch(id, data) {
    return this.request.patch(new URL(`/api/users/${id}`, this.baseURL).toString(), { data });
  }

  delete(id) {
    return this.request.delete(new URL(`/api/users/${id}`, this.baseURL).toString());
  }
}
