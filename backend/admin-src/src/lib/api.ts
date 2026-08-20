// Mismo backend, mismo origen: la cookie de sesión viaja sola. El header
// X-Requested-With es la segunda capa de defensa CSRF que exige el server
// en cada mutación (ver backend/src/auth.ts).
export class AuthError extends Error {}
export class ApiError extends Error {}

export async function api<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
  const method = options.method ?? "GET";
  const headers: Record<string, string> = { ...(options.headers as Record<string, string>) };
  if (method !== "GET") headers["X-Requested-With"] = "fetch";
  if (options.body) headers["Content-Type"] = "application/json";

  const res = await fetch(`/api${path}`, { ...options, method, headers, credentials: "same-origin" });
  if (res.status === 401) throw new AuthError("No autenticado");
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(body.error ?? `Error ${res.status}`);
  }
  return res.status === 204 ? (null as T) : res.json();
}
