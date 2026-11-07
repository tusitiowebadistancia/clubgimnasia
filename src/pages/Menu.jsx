import { useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { ShoppingCart, Send, X, Plus, Minus, Sparkles } from "lucide-react";
import MenuCard from "../components/sections/menu/MenuCard.jsx";
import Header from "../components/layout/Header.jsx";
import Footer from "../components/layout/Footer.jsx";
import CampaignVideoStrip from "../components/common/CampaignVideoStrip.jsx";

import {
  buildWhatsAppMessage,
  getVenueQueryFromSearch,
  WHATSAPP_NUMBER,
  formatPrice,
} from "../data/menuData";
import { resolveVenue } from "../services/venue";
import { createOrderIntent, orderRegistrationEnabled, registerOrder, validateOrderCart } from "../services/orders";

const apiBase = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:3001/api";

function catalogSections(catalog) {
  const toItem = (product) => {
    const price = Number(product.price);
    return {
      id: product.id,
      productId: product.id,
      name: product.menuDescription || product.name,
      price: Number.isFinite(price) && price > 0 ? price : null,
    };
  };
  const sections = catalog.categories
    .map((category) => ({
      id: category.id,
      title: category.name,
      description: category.description,
      brands: [{ id: `${category.id}-products`, name: "Productos", items: category.products.map(toItem) }],
    }));

  if (catalog.uncategorized.length) {
    sections.push({
      id: "uncategorized",
      title: "Otros",
      brands: [{ id: "uncategorized-products", name: "Productos", items: catalog.uncategorized.map(toItem) }],
    });
  }

  return sections;
}

export default function Menu() {
  const [cart, setCart] = useState([]);
  const [sections, setSections] = useState([]);
  const [openCategoryIds, setOpenCategoryIds] = useState(() => new Set());
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState(false);
  const [promotions, setPromotions] = useState([]);
  const [venueQuery] = useState(() => getVenueQueryFromSearch());
  const [venue, setVenue] = useState(null);
  const [venueLoading, setVenueLoading] = useState(Boolean(venueQuery));
  const [venueError, setVenueError] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [orderVerifying, setOrderVerifying] = useState(false);
  const [orderStatus, setOrderStatus] = useState(null);
  const orderSendingRef = useRef(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [confirmationSaving, setConfirmationSaving] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [registeredOrder, setRegisteredOrder] = useState(null);
  const orderIntentRef = useRef(null);
  const confirmationRef = useRef(false);

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast(null);
    }, 2200);

    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    let active = true;
    if (!venueQuery) return undefined;
    resolveVenue(venueQuery)
      .then((value) => { if (active) setVenue(value); })
      .catch(() => { if (active) setVenueError("No pudimos verificar esta ubicación. Escaneá nuevamente un QR activo."); })
      .finally(() => { if (active) setVenueLoading(false); });
    return () => { active = false; };
  }, [venueQuery]);

  useEffect(() => {
    let active = true;

    async function loadMenu() {
      try {
        const response = await fetch(`${apiBase}/public/menu`, { cache: "no-store" });
        if (!response.ok) throw new Error(`Error HTTP ${response.status}`);
        const catalog = await response.json();
        if (!Array.isArray(catalog?.categories) || !Array.isArray(catalog?.uncategorized)) throw new Error("Formato de catálogo inválido");
        if (!active) return;
        setSections(catalogSections(catalog));
        setCatalogError(false);
      } catch {
        if (!active) return;
        setSections([]);
        setCatalogError(true);
      } finally {
        if (active) setCatalogLoading(false);
      }
    }

    loadMenu();

    fetch(`${apiBase}/public/promotions?placement=MENU`)
      .then((response) => response.ok ? response.json() : [])
      .then((data) => { if (active && Array.isArray(data)) setPromotions(data); })
      .catch(() => undefined);

    return () => { active = false; };
  }, []);

  const promotionsByProductId = useMemo(() => new Map(promotions.map((promotion) => [promotion.productId, promotion])), [promotions]);

  const toggleCategory = (categoryId) => {
    setOpenCategoryIds((current) => {
      const next = new Set(current);
      if (next.has(categoryId)) next.delete(categoryId);
      else next.add(categoryId);
      return next;
    });
  };

  const totalItems = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  const totalAmount = useMemo(() => {
    return cart.reduce((acc, item) => {
      if (typeof item.price !== "number") return acc;
      return acc + item.price * item.quantity;
    }, 0);
  }, [cart]);

  const addToCart = (item) => {
    if (orderSendingRef.current || confirmationRef.current || typeof item.price !== "number" || item.price <= 0) return;

    orderIntentRef.current = null; setRegisteredOrder(null);
    setCart((prev) => {
      const existing = prev.find((entry) => entry.id === item.id);

      if (existing) {
        return prev.map((entry) =>
          entry.id === item.id
            ? { ...entry, quantity: entry.quantity + 1 }
            : entry
        );
      }

      return [...prev, { ...item, quantity: 1 }];
    });

    setToast(item.comment || "Excelente elección.");
  };

  const updateQuantity = (id, delta) => {
    if (orderSendingRef.current || confirmationRef.current) return;

    orderIntentRef.current = null; setRegisteredOrder(null);
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id) => {
    if (orderSendingRef.current || confirmationRef.current) return;

    orderIntentRef.current = null; setRegisteredOrder(null);
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const verifyCart = async (orderCart) => {
    const response = await fetch(`${apiBase}/public/menu`, { cache: "no-store", headers: { "cache-control": "no-cache" } });
    if (!response.ok) throw new Error("No se pudo verificar el catálogo");

    const catalog = await response.json();
    if (!Array.isArray(catalog?.categories) || !Array.isArray(catalog?.uncategorized)) throw new Error("Catálogo no válido");

    const productsById = new Map([...catalog.categories.flatMap((category) => category.products), ...catalog.uncategorized].map((product) => [product.id, product]));
    const unavailable = [];
    const priceChanges = [];

    orderCart.forEach((item) => {
      const product = productsById.get(item.productId);
      const price = Number(product?.price);
      if (!product || product.active !== true || !Number.isFinite(price) || price <= 0) {
        unavailable.push(item);
      } else if (price !== item.price) {
        priceChanges.push({ item, price });
      }
    });

    return { unavailable, priceChanges };
  };

  const updateCartPrices = (priceChanges) => {
    if (!priceChanges.length) return;
    const pricesByProductId = new Map(priceChanges.map(({ item, price }) => [item.productId, price]));
    setCart((current) => current.map((item) => pricesByProductId.has(item.productId) ? { ...item, price: pricesByProductId.get(item.productId) } : item));
  };

  const openPayment = async () => {
    if (!cart.length || !venue || orderSendingRef.current) return;

    orderSendingRef.current = true;
    const orderCart = cart;
    setOrderVerifying(true);
    setOrderStatus(null);

    try {
      const { unavailable, priceChanges } = await verifyCart(orderCart);
      updateCartPrices(priceChanges);

      if (unavailable.length) {
        setOrderStatus({ type: "error", message: `Revisá estos productos antes de pagar: ${unavailable.map((item) => item.name).join(", ")}. Podés eliminarlos del carrito.${priceChanges.length ? ` También actualizamos los precios de: ${priceChanges.map(({ item }) => item.name).join(", ")}.` : ""}` });
        return;
      }

      if (priceChanges.length) {
        setOrderStatus({ type: "warning", message: `Actualizamos los precios de: ${priceChanges.map(({ item }) => item.name).join(", ")}. Revisá el total y confirmá el pago nuevamente.` });
        return;
      }

      setPaymentOpen(true);
    } catch {
      setOrderStatus({ type: "error", message: "No pudimos verificar los precios actuales. Intentá nuevamente." });
    } finally {
      orderSendingRef.current = false;
      setOrderVerifying(false);
    }
  };

  const sendOrder = async () => {
    if (!cart.length || !venue || orderSendingRef.current) return;

    orderSendingRef.current = true;
    const orderCart = cart;
    const whatsappWindow = window.open("about:blank", "_blank");
    if (whatsappWindow) whatsappWindow.opener = null;
    setOrderVerifying(true);
    setOrderStatus(null);

    const closeWhatsAppWindow = () => {
      if (whatsappWindow && !whatsappWindow.closed) whatsappWindow.close();
    };

    try {
      const { unavailable, priceChanges } = await verifyCart(orderCart);
      updateCartPrices(priceChanges);

      if (unavailable.length) {
        closeWhatsAppWindow();
        setPaymentOpen(false);
        setOrderStatus({ type: "error", message: `Revisá estos productos antes de enviar: ${unavailable.map((item) => item.name).join(", ")}. Podés eliminarlos del carrito.${priceChanges.length ? ` También actualizamos los precios de: ${priceChanges.map(({ item }) => item.name).join(", ")}.` : ""}` });
        return;
      }

      if (priceChanges.length) {
        closeWhatsAppWindow();
        setPaymentOpen(false);
        setOrderStatus({ type: "warning", message: `Actualizamos los precios de: ${priceChanges.map(({ item }) => item.name).join(", ")}. Revisá el total y confirmá el pedido nuevamente.` });
        return;
      }

      if (!whatsappWindow || whatsappWindow.closed) {
        setOrderStatus({ type: "error", message: "El navegador bloqueó la apertura de WhatsApp. Intentá nuevamente." });
        return;
      }

      const message = buildWhatsAppMessage(venue, orderCart);
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      whatsappWindow.location.href = url;
    } catch {
      closeWhatsAppWindow();
      setPaymentOpen(false);
      setOrderStatus({ type: "error", message: "No pudimos verificar los precios actuales. Intentá nuevamente." });
    } finally {
      orderSendingRef.current = false;
      setOrderVerifying(false);
    }
  };

  function openConfirmation() {
    if (!orderRegistrationEnabled || !cart.length || !venueQuery) return;
    setConfirmationMessage("");
    setConfirmationOpen(true);
  }

  async function confirmOrder() {
    if (confirmationRef.current || registeredOrder) return;
    confirmationRef.current = true; setConfirmationSaving(true); setConfirmationMessage("");
    try {
      const validation = await validateOrderCart(cart);
      if (validation.unavailable.length) { setConfirmationMessage(`Revisá estos productos antes de registrar: ${validation.unavailable.map((item) => item.name).join(", ")}.`); return; }
      if (validation.priceChanges.length) {
        const prices = new Map(validation.priceChanges.map((item) => [item.productId, item.price]));
        setCart((current) => current.map((item) => prices.has(item.productId) ? { ...item, price: prices.get(item.productId) } : item));
        orderIntentRef.current = null;
        setConfirmationMessage("Actualizamos los precios oficiales. Revisá el nuevo total y confirmá nuevamente.");
        return;
      }
      orderIntentRef.current ??= createOrderIntent(venueQuery, cart);
      const order = await registerOrder(orderIntentRef.current);
      const officialPrices = new Map(order.items.map((item) => [item.productId, Number(item.unitPrice)]));
      const changed = Number(order.total) !== totalAmount || cart.some((item) => officialPrices.get(item.productId) !== item.price);
      if (changed) {
        setCart((current) => current.map((item) => officialPrices.has(item.productId) ? { ...item, price: officialPrices.get(item.productId) } : item));
        setRegisteredOrder(order);
        setConfirmationMessage("El servidor registró un pedido pendiente con precios distintos. Revisá el total; no se creó un segundo pedido.");
        return;
      }
      setRegisteredOrder(order);
      setConfirmationMessage(`Pedido ${order.orderNumber} registrado como pendiente.`);
    } catch (reason) { setConfirmationMessage(reason.message); } finally { confirmationRef.current = false; setConfirmationSaving(false); }
  }

  return (
    <>
      <Helmet>
        <title>Menú Digital | Club Gimnasia Necochea</title>
        <meta
          name="description"
          content="Menú digital de Club Gimnasia en Necochea."
        />

        <meta name="google" content="notranslate" />
        <meta
          name="keywords"
          content="menu club gimnasia, bowling necochea menu, pool necochea menu, tragos necochea, cervezas necochea, pizzas necochea"
        />
        <link rel="canonical" href={`${window.location.origin}/menu`} />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-[#041019] text-white">
        <style>{`
          .menu-neon-price {
            text-shadow:
              0 0 6px rgba(34, 211, 238, 0.75),
              0 0 14px rgba(34, 211, 238, 0.55),
              0 0 28px rgba(168, 85, 247, 0.35);
            animation: neonPulse 1.6s ease-in-out infinite;
          }

          @keyframes neonPulse {
            0%, 100% {
              opacity: 1;
              filter: brightness(1);
            }
            50% {
              opacity: 0.78;
              filter: brightness(1.3);
            }
          }

          @keyframes floatCart {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-4px);
            }
          }

          .floating-cart-btn {
            animation: floatCart 2.6s ease-in-out infinite;
          }
        `}</style>

        <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
          <span className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.32em] text-cyan-300">
            Menú
          </span>

          <h1 className="mt-4 max-w-4xl text-4xl font-black uppercase tracking-[0.06em] text-white md:text-6xl">
            Club Gimnasia
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-relaxed text-white/72 md:text-lg">
            {venueLoading ? "Verificando ubicación…" : venue ? <>Bienvenido, estás en <strong className="text-cyan-300">{venue.label}</strong>. Agregá al carrito y enviá el pedido por WhatsApp con la ubicación identificada.</> : venueError || "Estás viendo el menú general. Escaneá un QR activo para enviar pedidos por WhatsApp."}
          </p>
        </div>

        <CampaignVideoStrip placement="MENU_AFTER_INTRO" />

        <div className="mx-auto max-w-7xl px-4 pb-16 md:px-6">
          <div className="grid gap-6">
            {catalogLoading && <p className="rounded-[24px] border border-white/10 bg-white/[0.03] p-6 text-white/65">Cargando menú oficial...</p>}
            {catalogError && <p className="rounded-[24px] border border-rose-400/20 bg-rose-400/10 p-6 text-rose-100">No pudimos cargar el menú oficial. Intentá nuevamente en unos minutos.</p>}
            {!catalogLoading && !catalogError && sections.map((section) => (
              <MenuCard key={section.id} section={section} onAdd={addToCart} promotionsByProductId={promotionsByProductId} cartLocked={orderVerifying} isOpen={openCategoryIds.has(section.id)} onToggle={() => toggleCategory(section.id)} />
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setCartOpen(true)}
          className="floating-cart-btn fixed bottom-6 right-5 z-40 inline-flex h-16 min-w-[64px] items-center justify-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-400/15 px-5 text-cyan-200 shadow-[0_0_40px_rgba(34,211,238,0.32)] backdrop-blur-xl transition hover:scale-[1.03] hover:bg-cyan-400/25"
        >
          <ShoppingCart size={22} />
          <span className="text-sm font-black">{totalItems}</span>
        </button>

        {toast && (
          <div className="fixed left-1/2 top-6 z-50 -translate-x-1/2 rounded-full border border-cyan-400/25 bg-slate-950/90 px-5 py-3 text-sm font-bold text-cyan-200 shadow-[0_10px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            <span className="inline-flex items-center gap-2">
              <Sparkles size={16} />
              {toast}
            </span>
          </div>
        )}

        <div
          className={`fixed inset-0 z-50 transition ${
            cartOpen
              ? "pointer-events-auto bg-black/55 opacity-100"
              : "pointer-events-none opacity-0"
          }`}
          onClick={() => { if (!orderVerifying) setCartOpen(false); }}
        />

        <aside
          className={`fixed right-0 top-0 z-[60] h-full w-full max-w-md transform border-l border-white/10 bg-[#07131c] shadow-[-20px_0_60px_rgba(0,0,0,0.35)] transition duration-300 ${
            cartOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300/80">
                  {venue?.label ?? "Ubicación no identificada"}
                </p>
                <h2 className="mt-1 text-2xl font-black uppercase tracking-[0.06em] text-white">
                  Tu carrito
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setCartOpen(false)}
                disabled={orderVerifying}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/75 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5">
              {cart.length === 0 ? (
                <div className="rounded-[26px] border border-dashed border-white/10 bg-white/[0.03] p-6 text-center">
                  <p className="text-lg font-bold text-white">
                    Todavía no agregaste productos
                  </p>
                  <p className="mt-2 text-sm text-white/60">
                    Elegí comidas, bebidas, cervezas o tragos y aparecerán acá.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <article
                      key={item.id}
                      className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-base font-bold text-white">
                            {item.name}
                          </h3>
                          <p className="mt-1 text-xs uppercase tracking-[0.14em] text-cyan-300/80">
                            {item.size || "Sin detalle"}
                          </p>
                          <p className="mt-3 text-sm font-bold text-cyan-200">
                            {item.priceLabel || formatPrice(item.price)}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          disabled={orderVerifying}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-red-400/20 bg-red-400/10 text-red-200 transition hover:bg-red-400/20 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <X size={16} />
                        </button>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="inline-flex items-center rounded-full border border-white/10 bg-black/25 p-1">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, -1)}
                            disabled={orderVerifying}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white/75 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Minus size={16} />
                          </button>

                          <span className="min-w-[34px] text-center text-sm font-black text-white">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, 1)}
                            disabled={orderVerifying}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white/75 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        <p className="text-sm font-bold text-white">
                          {typeof item.price === "number"
                            ? formatPrice(item.price * item.quantity)
                            : item.priceLabel || "Consultar"}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-white/10 p-5">
              <div className="mb-4 flex items-center justify-between rounded-2xl bg-white/[0.04] px-4 py-3">
                <span className="text-sm uppercase tracking-[0.14em] text-white/60">
                  Total
                </span>
                <strong className="menu-neon-price text-xl font-black text-cyan-300">
                  {formatPrice(totalAmount)}
                </strong>
              </div>
              {orderStatus && <p role="alert" className={`mb-4 rounded-2xl border px-4 py-3 text-sm ${orderStatus.type === "warning" ? "border-yellow-300/20 bg-yellow-300/10 text-yellow-100" : "border-rose-400/20 bg-rose-400/10 text-rose-100"}`}>{orderStatus.message}</p>}

              <button
                type="button"
                onClick={sendOrder}
                  disabled={!cart.length || !venue || orderVerifying}
                className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl border border-cyan-400/25 bg-cyan-400/15 px-5 text-sm font-black uppercase tracking-[0.12em] text-cyan-100 shadow-[0_0_30px_rgba(34,211,238,0.18)] transition hover:bg-cyan-400/25 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send size={18} />
                {orderVerifying ? "Verificando precios..." : "Enviar pedido por WhatsApp"}
              </button>

              {orderRegistrationEnabled && <button type="button" onClick={openConfirmation} disabled={!cart.length || !venue || orderVerifying} className="mt-3 inline-flex h-14 w-full items-center justify-center rounded-2xl border border-emerald-400/25 bg-emerald-400/10 px-5 text-sm font-black uppercase tracking-[0.12em] text-emerald-100 transition hover:bg-emerald-400/20 disabled:cursor-not-allowed disabled:opacity-50">Confirmar pedido</button>}

              <button
                type="button"
                onClick={openPayment}
                disabled={!cart.length || !venue || orderVerifying}
                className="mt-3 inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl border border-yellow-400/25 bg-yellow-400/15 px-5 text-sm font-black uppercase tracking-[0.12em] text-yellow-100 shadow-[0_0_30px_rgba(250,204,21,0.14)] transition hover:bg-yellow-400/25 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {orderVerifying ? "Verificando precios..." : "Pagar ahora"}
              </button>
            </div>
          </div>
        </aside>

        {paymentOpen && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
            <div className="relative w-full max-w-md rounded-[2rem] border border-yellow-300/20 bg-[#07131c] p-6 text-center shadow-[0_0_60px_rgba(250,204,21,0.14)]">
              <button
                type="button"
                onClick={() => setPaymentOpen(false)}
                disabled={orderVerifying}
                className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <X size={18} />
              </button>

              <p className="text-xs font-bold uppercase tracking-[0.24em] text-yellow-300/80">
                Pago por transferencia
              </p>

              <h2 className="mt-3 text-4xl font-black text-white">
                {formatPrice(totalAmount)}
              </h2>

              <p className="mt-2 text-sm text-white/60">{venue?.label ?? "Ubicación no identificada"}</p>

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-left">
                <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-cyan-300">
                  Datos de transferencia
                </h3>

                <div className="mt-4 space-y-3 text-sm text-white/75">
                  <p>
                    <strong className="text-white">Alias:</strong> pool67
                  </p>

                  <p>
                    <strong className="text-white">CVU:</strong>{" "}
                    0000003100039014905557
                  </p>

                  <p>
                    <strong className="text-white">Nombre:</strong>{" "}
                    Leonardo Moreno Pertusi
                  </p>
                </div>
              </div>

              <p className="mt-5 rounded-2xl border border-yellow-300/20 bg-yellow-300/10 px-4 py-3 text-sm font-semibold text-yellow-100">
                Guardá el comprobante de pago.
              </p>

              <button
  type="button"
  onClick={sendOrder}
  disabled={!cart.length || !venue || orderVerifying}
  className="mt-5 inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl border border-green-400/25 bg-green-400/15 px-5 text-sm font-black uppercase tracking-[0.12em] text-green-100 shadow-[0_0_30px_rgba(34,197,94,0.18)] transition hover:bg-green-400/25 disabled:cursor-not-allowed disabled:opacity-50"
>
  <Send size={18} />
  {orderVerifying ? "Verificando precios..." : "Enviar la orden"}
</button>

<button
  type="button"
  onClick={() => setPaymentOpen(false)}
  disabled={orderVerifying}
  className="mt-3 inline-flex h-12 w-full items-center justify-center rounded-2xl border border-cyan-400/25 bg-cyan-400/10 text-sm font-black uppercase tracking-[0.12em] text-cyan-100 transition hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-40"
>
  Volver al menú
</button>
            </div>
          </div>
        )}
        {confirmationOpen && <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"><div className="w-full max-w-md rounded-[2rem] border border-emerald-300/20 bg-[#07131c] p-6 shadow-[0_0_60px_rgba(34,197,94,0.14)]"><button type="button" onClick={() => !confirmationSaving && setConfirmationOpen(false)} disabled={confirmationSaving} className="float-right rounded-lg p-2 text-white/70 disabled:opacity-40"><X size={18} /></button><p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-300/80">Confirmación de pedido</p><h2 className="mt-3 text-2xl font-black text-white">{venue?.label ?? "Ubicación no identificada"}</h2><p className="mt-2 text-sm text-white/60">El precio definitivo será validado por el servidor antes de registrar el pedido.</p><div className="mt-5 space-y-3">{cart.map((item) => <div key={item.id} className="flex justify-between gap-4 text-sm"><span>{item.quantity} × {item.name}</span><strong>{formatPrice(item.price * item.quantity)}</strong></div>)}</div><div className="mt-5 border-t border-white/10 pt-4 text-right text-xl font-black text-emerald-200">{formatPrice(totalAmount)}</div>{confirmationMessage && <p role="alert" className="mt-4 rounded-xl border border-white/10 bg-white/[0.04] p-3 text-sm text-white/80">{confirmationMessage}</p>}<button type="button" onClick={confirmOrder} disabled={confirmationSaving} className="mt-5 inline-flex h-14 w-full items-center justify-center rounded-2xl bg-emerald-300 px-5 text-sm font-black uppercase tracking-[0.12em] text-slate-950 disabled:opacity-50">{confirmationSaving ? "Registrando..." : "Confirmar pedido"}</button></div></div>}
      </main>

      <Footer />
    </>
  );
}
