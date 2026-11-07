const apiBase = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001/api";

export async function getOperation() {
  const response = await fetch(`${apiBase}/public/operation`);
  if (!response.ok) throw new Error("No se pudo consultar el estado del local");
  return response.json();
}
