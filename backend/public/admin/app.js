// Helper de fetch compartido por el panel: agrega el header que
// requireAuth exige en el backend para todo lo que no sea GET (defensa
// extra contra CSRF — ver src/auth.ts).
async function api(path, options = {}) {
  const method = options.method || "GET";
  const headers = { ...(options.headers || {}) };
  if (method !== "GET") headers["X-Requested-With"] = "fetch";
  if (options.body) headers["Content-Type"] = "application/json";

  const res = await fetch(`/api${path}`, { ...options, method, headers, credentials: "same-origin" });
  if (res.status === 401) {
    window.location.href = "/admin/login";
    throw new Error("No autenticado");
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Error ${res.status}`);
  }
  return res.status === 204 ? null : res.json();
}

/** Redirige a login si no hay sesión — llamar al cargar cualquier página
 * protegida del panel. */
async function requireSession() {
  try {
    return await api("/auth/me");
  } catch {
    window.location.href = "/admin/login";
    return null;
  }
}
