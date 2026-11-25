export class ResourceClient {
  constructor(
    request,
    baseURL = process.env.REQRES_BASE_URL || process.env.API_BASE_URL || 'https://reqres.in/',
  ) {
    this.request = request;
    this.baseURL = baseURL;
  }

  list(page = 1) {
    const url = new URL('/api/unknown', this.baseURL);
    url.searchParams.set('page', String(page));
    return this.request.get(url.toString());
  }

  getById(id) {
    return this.request.get(new URL(`/api/unknown/${id}`, this.baseURL).toString());
  }
}
