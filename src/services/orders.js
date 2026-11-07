const apiBase = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001/api";
export const orderRegistrationEnabled = import.meta.env.VITE_ENABLE_ORDER_REGISTRATION === "true";

export function createOrderIntent(venue, cart) {
  if (!venue?.qr && !venue?.mesa) throw new Error("Ubicación requerida");
  const items = cart.map(({ productId, quantity, price }) => ({ productId, quantity, expectedUnitPrice: Number(price).toFixed(2) }));
  if (!items.length || items.some(({ productId, quantity }) => !productId || !Number.isInteger(quantity) || quantity <= 0)) throw new Error("Carrito inválido");
  return { idempotencyKey: crypto.randomUUID(), venue: { ...(venue.qr ? { qr: venue.qr } : { mesa: venue.mesa }) }, items };
}

export async function validateOrderCart(cart) {
  const response = await fetch(`${apiBase}/public/menu`, { cache: "no-store", headers: { "cache-control": "no-cache" } });
  if (!response.ok) throw new Error("No pudimos verificar los precios actuales. Intentá nuevamente.");
  const catalog = await response.json();
  if (!Array.isArray(catalog?.categories) || !Array.isArray(catalog?.uncategorized)) throw new Error("Catálogo no válido");
  const products = [...catalog.categories.flatMap((category) => category.products), ...catalog.uncategorized]; const byId = new Map(products.map((product) => [product.id, product])); const unavailable = []; const priceChanges = [];
  cart.forEach((item) => { const product = byId.get(item.productId); const price = Number(product?.price); if (!product || product.active !== true || !Number.isFinite(price) || price <= 0) unavailable.push(item); else if (price !== item.price) priceChanges.push({ productId: item.productId, price }); });
  return { unavailable, priceChanges };
}

function validateOrderResponse(order, intent) {
  const requested = new Map(intent.items.map((item) => [item.productId, item.quantity]));
  if (!order || typeof order.id !== "string" || typeof order.orderNumber !== "string" || order.status !== "PENDING" || order.currency !== "ARS" || !Array.isArray(order.items) || order.items.length !== requested.size) throw new Error("Respuesta de pedido inválida");
  if (!order.items.every((item) => requested.get(item.productId) === item.quantity && Number.isFinite(Number(item.unitPrice)) && Number.isFinite(Number(item.lineTotal)))) throw new Error("Respuesta de pedido inválida");
  return order;
}

export async function registerOrder(intent) {
  if (!orderRegistrationEnabled) return null;
  const response = await fetch(`${apiBase}/public/orders`, { method: "POST", headers: { accept: "application/json", "content-type": "application/json" }, body: JSON.stringify(intent) });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(data?.error ?? "No se pudo registrar el pedido");
    error.status = response.status;
    throw error;
  }
  return validateOrderResponse(data, intent);
}
