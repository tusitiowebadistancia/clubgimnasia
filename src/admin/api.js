const apiBase = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001/api";

function csrfToken() {
  return document.cookie.split("; ").find((value) => value.startsWith("bcg_csrf="))?.split("=")[1] ?? "";
}

export async function adminRequest(path, options = {}) {
  const { body, headers, ...requestOptions } = options;
  const response = await fetch(`${apiBase}${path}`, {
    credentials: "include",
    headers: { accept: "application/json", ...(body ? { "content-type": "application/json" } : {}), ...(requestOptions.method && requestOptions.method !== "GET" ? { "x-csrf-token": csrfToken() } : {}), ...headers },
    body: body ? JSON.stringify(body) : undefined,
    ...requestOptions,
  });
  if (response.status === 204) return null;
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.error ?? (response.status === 429 ? "Demasiados intentos. Esperá unos minutos antes de volver a ingresar." : "No se pudo completar la operación"));
  return data;
}
