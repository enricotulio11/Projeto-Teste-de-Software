const API_BASE_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:3000').replace(
  /\/$/,
  '',
);

const ACCESS_TOKEN_KEY = 'medagenda_access_token';

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

type ApiRequestOptions = RequestInit & {
  auth?: boolean;
};

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function clearAccessToken(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

export async function apiRequest<T>(
  path: string,
  { auth = true, headers, body, ...options }: ApiRequestOptions = {},
): Promise<T> {
  const token = getAccessToken();
  const requestHeaders = new Headers(headers);

  if (body && !requestHeaders.has('Content-Type')) {
    requestHeaders.set('Content-Type', 'application/json');
  }

  if (auth && token) {
    requestHeaders.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: requestHeaders,
    body,
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new ApiError(getErrorMessage(data, response.statusText), response.status, data);
  }

  return data as T;
}

export function apiGet<T>(path: string, options?: ApiRequestOptions): Promise<T> {
  return apiRequest<T>(path, { ...options, method: 'GET' });
}

export function apiPost<T>(
  path: string,
  payload?: unknown,
  options?: ApiRequestOptions,
): Promise<T> {
  return apiRequest<T>(path, {
    ...options,
    method: 'POST',
    body: payload === undefined ? undefined : JSON.stringify(payload),
  });
}

export function apiPatch<T>(
  path: string,
  payload?: unknown,
  options?: ApiRequestOptions,
): Promise<T> {
  return apiRequest<T>(path, {
    ...options,
    method: 'PATCH',
    body: payload === undefined ? undefined : JSON.stringify(payload),
  });
}

export function apiDelete<T>(path: string, options?: ApiRequestOptions): Promise<T> {
  return apiRequest<T>(path, { ...options, method: 'DELETE' });
}

async function parseResponse(response: Response): Promise<unknown> {
  if (response.status === 204) {
    return null;
  }

  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function getErrorMessage(data: unknown, fallback: string): string {
  if (typeof data === 'object' && data !== null && 'message' in data) {
    const message = (data as { message: unknown }).message;
    return Array.isArray(message) ? message.join(', ') : String(message);
  }

  return fallback || 'Erro na requisicao';
}
