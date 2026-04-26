import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { ShoppingCart, Send, X, Plus, Minus, Sparkles } from "lucide-react";
import MenuCard from "../components/sections/menu/MenuCard.jsx";
import Header from "../components/layout/Header.jsx";
import Footer from "../components/layout/Footer.jsx";

import {
  buildWhatsAppMessage,
  getTableFromSearch,
  menuData,
  WHATSAPP_NUMBER,
  formatPrice,
} from "../data/menuData";

export default function Menu() {
  const [cart, setCart] = useState([]);
  const [table] = useState(() => getTableFromSearch());
  const [cartOpen, setCartOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast(null);
    }, 2200);

    return () => clearTimeout(timer);
  }, [toast]);

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
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const sendOrder = () => {
    if (!cart.length) return;

    const message = buildWhatsAppMessage(table, cart);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      message
    )}`;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <Helmet>
        <title>Menú Digital | Club Gimnasia Necochea</title>
        <meta
          name="description"
          content={`Menú digital de Club Gimnasia en Necochea. Estás viendo el menú de la mesa ${table}.`}
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
            Bienvenido, estás en la{" "}
            <strong className="text-cyan-300">Mesa {table}</strong>. Agregá al
            carrito lo que querés y luego enviá tu pedido por WhatsApp con la
            mesa ya identificada.
          </p>
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-16 md:px-6">
          <div className="grid gap-6">
            {menuData.map((section) => (
              <MenuCard key={section.id} section={section} onAdd={addToCart} />
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
          onClick={() => setCartOpen(false)}
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
                  Mesa {table}
                </p>
                <h2 className="mt-1 text-2xl font-black uppercase tracking-[0.06em] text-white">
                  Tu carrito
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setCartOpen(false)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/75 transition hover:bg-white/10"
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
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-red-400/20 bg-red-400/10 text-red-200 transition hover:bg-red-400/20"
                        >
                          <X size={16} />
                        </button>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="inline-flex items-center rounded-full border border-white/10 bg-black/25 p-1">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, -1)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white/75 transition hover:bg-white/10"
                          >
                            <Minus size={16} />
                          </button>

                          <span className="min-w-[34px] text-center text-sm font-black text-white">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, 1)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white/75 transition hover:bg-white/10"
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

              <button
                type="button"
                onClick={sendOrder}
                disabled={!cart.length}
                className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl border border-cyan-400/25 bg-cyan-400/15 px-5 text-sm font-black uppercase tracking-[0.12em] text-cyan-100 shadow-[0_0_30px_rgba(34,211,238,0.18)] transition hover:bg-cyan-400/25 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send size={18} />
                Enviar pedido por WhatsApp
              </button>

              <button
                type="button"
                onClick={() => setPaymentOpen(true)}
                disabled={!cart.length}
                className="mt-3 inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl border border-yellow-400/25 bg-yellow-400/15 px-5 text-sm font-black uppercase tracking-[0.12em] text-yellow-100 shadow-[0_0_30px_rgba(250,204,21,0.14)] transition hover:bg-yellow-400/25 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Pagar ahora
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
                className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10"
              >
                <X size={18} />
              </button>

              <p className="text-xs font-bold uppercase tracking-[0.24em] text-yellow-300/80">
                Pago por transferencia
              </p>

              <h2 className="mt-3 text-4xl font-black text-white">
                {formatPrice(totalAmount)}
              </h2>

              <p className="mt-2 text-sm text-white/60">Mesa {table}</p>

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
  disabled={!cart.length}
  className="mt-5 inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl border border-green-400/25 bg-green-400/15 px-5 text-sm font-black uppercase tracking-[0.12em] text-green-100 shadow-[0_0_30px_rgba(34,197,94,0.18)] transition hover:bg-green-400/25 disabled:cursor-not-allowed disabled:opacity-50"
>
  <Send size={18} />
  Enviar la orden
</button>

<button
  type="button"
  onClick={() => setPaymentOpen(false)}
  className="mt-3 inline-flex h-12 w-full items-center justify-center rounded-2xl border border-cyan-400/25 bg-cyan-400/10 text-sm font-black uppercase tracking-[0.12em] text-cyan-100 transition hover:bg-cyan-400/20"
>
  Volver al menú
</button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}