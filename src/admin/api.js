const apiBase = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001/api";
let csrfToken = "";

export async function adminRequest(path, options = {}) {
  const { body, headers, ...requestOptions } = options;
  const response = await fetch(`${apiBase}${path}`, {
    credentials: "include",
    headers: { accept: "application/json", ...(body ? { "content-type": "application/json" } : {}), ...(requestOptions.method && requestOptions.method !== "GET" ? { "x-csrf-token": csrfToken } : {}), ...headers },
    body: body ? JSON.stringify(body) : undefined,
    ...requestOptions,
  });
  if (response.status === 204) {
    if (path === "/admin/auth/logout") csrfToken = "";
    return null;
  }
  const data = await response.json().catch(() => null);
  if (response.status === 401) csrfToken = "";
  if (!response.ok) {
    const retryAfterSeconds = Number(response.headers.get("retry-after") ?? data?.retryAfterSeconds);
    const wait = Number.isFinite(retryAfterSeconds) && retryAfterSeconds > 0 ? ` Intentá nuevamente en ${Math.ceil(retryAfterSeconds / 60)} minuto${Math.ceil(retryAfterSeconds / 60) === 1 ? "" : "s"}.` : "";
    const error = new Error(data?.error ?? (response.status === 429 ? `Demasiados intentos.${wait}` : "No se pudo completar la operación"));
    error.status = response.status;
    throw error;
  }
  if (typeof data?.csrfToken === "string") csrfToken = data.csrfToken;
  return data;
}
