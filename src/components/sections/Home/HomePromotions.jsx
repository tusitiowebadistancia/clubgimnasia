import { useEffect, useState } from "react";

const apiBase = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001/api";
const currency = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" });

function formatReduction(value) {
  return new Intl.NumberFormat("es-AR", { maximumFractionDigits: 2 }).format(Number(value));
}

function formatExpiration(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toLocaleDateString("es-AR", { dateStyle: "long" });
}

export default function HomePromotions() {
  const [promotions, setPromotions] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`${apiBase}/public/promotions?placement=HOME`, { signal: controller.signal })
      .then((response) => response.ok ? response.json() : [])
      .then((data) => setPromotions(Array.isArray(data) ? data : []))
      .catch((error) => { if (error.name !== "AbortError") setPromotions([]); });

    return () => controller.abort();
  }, []);

  if (!promotions?.length) return null;

  return <section aria-labelledby="home-promotions-title" className="bg-[#071018] px-4 py-16 text-white sm:px-6 lg:px-10">
    <div className="mx-auto max-w-7xl">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold tracking-[0.24em] text-cyan-300">PRECIOS OFICIALES</p>
        <h2 id="home-promotions-title" className="mt-3 text-3xl font-semibold sm:text-4xl">Promociones vigentes</h2>
        <p className="mt-3 text-white/65">Descuentos disponibles por tiempo limitado.</p>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {promotions.map((promotion) => {
          const expiration = promotion.expiresAt ? formatExpiration(promotion.expiresAt) : null;
          return <article key={promotion.promotionId} className="promo-card relative overflow-hidden rounded-2xl p-5 sm:p-6">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />
            <span className="inline-flex rounded-full border border-cyan-300/40 bg-cyan-300/10 px-3 py-1 text-xs font-bold tracking-[0.16em] text-cyan-200">PROMOCIÓN</span>
            <h3 className="mt-5 text-xl font-semibold text-white">{promotion.name}</h3>
            <div className="mt-5 flex items-end gap-3">
              <p className="text-sm text-white/50 line-through">{currency.format(Number(promotion.previousPrice))}</p>
              <p className="text-2xl font-bold text-cyan-200">{currency.format(Number(promotion.currentPrice))}</p>
            </div>
            <p className="mt-3 text-sm font-semibold text-emerald-300">{formatReduction(promotion.reductionPercent)}% de reducción</p>
            {expiration && <p className="mt-5 border-t border-white/10 pt-4 text-xs text-white/55">Válida hasta el {expiration}</p>}
          </article>;
        })}
      </div>
    </div>
  </section>;
}
