export class AuthClient {
  constructor(
    request,
    baseURL = process.env.REQRES_BASE_URL || process.env.API_BASE_URL || 'https://reqres.in/',
  ) {
    this.request = request;
    this.baseURL = baseURL;
  }

  login(email, password) {
    return this.request.post(new URL('/api/login', this.baseURL).toString(), {
      data: { email, password },
    });
  }

  register(email, password) {
    return this.request.post(new URL('/api/register', this.baseURL).toString(), {
      data: { email, password },
    });
  }
}
