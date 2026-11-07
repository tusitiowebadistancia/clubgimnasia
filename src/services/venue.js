const apiBase = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001/api";

export async function resolveVenue(query) {
  if (!query) return null;
  const response = await fetch(`${apiBase}/public/venues/resolve?${new URLSearchParams(query)}`);
  if (!response.ok) return null;
  return response.json();
}
