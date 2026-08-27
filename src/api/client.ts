// Thin fetch wrapper for the BringDollar Express/Mongoose backend (see server/API.md).
// Every resource is addressed by the client-generated `id` string field.

const API_BASE_URL: string =
  (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    let message = `${res.status} ${res.statusText}`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      // response wasn't JSON; keep default message
    }
    throw new Error(message);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};

/**
 * Fire a mutation against the backend without blocking the UI's optimistic local
 * state update. Failures are logged and surfaced via the provided toast callback
 * instead of throwing into the caller (the local state has already been updated).
 */
export function syncToServer(
  promise: Promise<unknown>,
  onError?: (message: string) => void
): void {
  promise.catch((err: Error) => {
    console.error('[api] sync failed:', err.message);
    onError?.(err.message);
  });
}
