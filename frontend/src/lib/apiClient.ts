const BASE = "/api";

interface RequestOptions {
  signal?: AbortSignal;
}

export async function post<T>(path: string, body: unknown, options: RequestOptions = {}): Promise<T> {
  const response = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: options.signal,
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    const message =
      (data as { error?: string; errors?: string[] }).error ??
      (data as { errors?: string[] }).errors?.join(", ") ??
      `HTTP ${response.status}`;
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export async function postStream(
  path: string,
  body: unknown,
  options: RequestOptions = {}
): Promise<Response> {
  const response = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: options.signal,
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response;
}
