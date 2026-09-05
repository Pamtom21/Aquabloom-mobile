import { ApiError, createHttpClient } from '../http';

describe('HTTP client', () => {
  const fetcher = jest.fn();
  beforeEach(() => fetcher.mockReset());
  it('uses the API prefix and a current bearer token', async () => {
    fetcher.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ status: 'ok' }),
    });
    const request = createHttpClient(
      'https://example.com/api/v1/',
      async () => 'test-token',
      fetcher,
    );
    await expect(request('/health')).resolves.toEqual({ status: 'ok' });
    expect(fetcher.mock.calls[0][0]).toBe('https://example.com/api/v1/health');
    expect(fetcher.mock.calls[0][1].headers.get('Authorization')).toBe(
      'Bearer test-token',
    );
  });
  it('does not leak a server error body', async () => {
    fetcher.mockResolvedValue({
      ok: false,
      status: 401,
      text: async () => 'private detail',
    });
    await expect(
      createHttpClient('https://example.com', undefined, fetcher)('/health'),
    ).rejects.toEqual(
      new ApiError(401, 'Tu sesión venció. Inicia sesión nuevamente.'),
    );
  });
  it('rejects absolute destinations before obtaining credentials', async () => {
    const token = jest.fn();
    await expect(
      createHttpClient(
        'https://example.com',
        token,
        fetcher,
      )('https://other.example'),
    ).rejects.toThrow('relativa');
    expect(token).not.toHaveBeenCalled();
    expect(fetcher).not.toHaveBeenCalled();
  });
  it('handles no-content and forwards cancellation', async () => {
    fetcher.mockResolvedValue({ ok: true, status: 204 });
    const controller = new AbortController();
    await expect(
      createHttpClient(
        'https://example.com',
        undefined,
        fetcher,
      )('/resource', { signal: controller.signal }),
    ).resolves.toBeUndefined();
    expect(fetcher.mock.calls[0][1].signal).toBe(controller.signal);
  });
});
