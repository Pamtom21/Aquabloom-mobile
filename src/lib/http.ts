export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function createHttpClient(
  baseUrl: string,
  getToken: () => Promise<string | null> = async () => null,
  fetcher: typeof fetch = fetch,
) {
  return async function request<T>(
    path: string,
    init: RequestInit = {},
  ): Promise<T> {
    // Keep credentials on the configured API origin.
    if (
      !path.startsWith('/') ||
      path.startsWith('//') ||
      path.includes('://')
    ) {
      throw new Error('La ruta debe ser relativa a la API.');
    }
    const headers = new Headers(init.headers);
    headers.set('Accept', 'application/json');
    if (init.body && !headers.has('Content-Type'))
      headers.set('Content-Type', 'application/json');
    const token = await getToken();
    if (token) headers.set('Authorization', `Bearer ${token}`);
    const response = await fetcher(`${baseUrl.replace(/\/$/, '')}${path}`, {
      ...init,
      headers,
      signal: init.signal ?? AbortSignal.timeout(15000),
    });
    if (!response.ok) {
      throw new ApiError(
        response.status,
        response.status === 401
          ? 'Tu sesión venció. Inicia sesión nuevamente.'
          : `No se pudo completar la solicitud (${response.status}).`,
      );
    }
    if (response.status === 204) return undefined as T;
    return (await response.json()) as T;
  };
}
