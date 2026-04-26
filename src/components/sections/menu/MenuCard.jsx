import { useMemo, useState } from "react";
import { ChevronDown, ShoppingCart } from "lucide-react";
import { formatPrice } from "../../../data/menuData";

export default function MenuCard({ section, onAdd }) {
  const [openBrand, setOpenBrand] = useState(
    section.brands?.[0]?.id || null
  );

  const sortedBrands = useMemo(() => {
    return [...section.brands].sort((a, b) =>
      a.name.localeCompare(b.name, "es")
    );
  }, [section.brands]);

  const toggleBrand = (brandId) => {
    setOpenBrand((prev) => (prev === brandId ? null : brandId));
  };

  return (
    <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/5 p-4 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl md:p-6">
      <div className="mb-5">
        <span className="mb-2 inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.28em] text-cyan-300">
          Club Gimnasia
        </span>

        <h2 className="text-2xl font-black uppercase tracking-[0.06em] text-white md:text-3xl">
          {section.title}
        </h2>

        {section.description && (
          <p className="mt-2 max-w-2xl text-sm text-white/65 md:text-base">
            {section.description}
          </p>
        )}
      </div>

      <div className="space-y-3">
        {sortedBrands.map((brand, index) => {
          const isOpen = openBrand === brand.id;

          return (
            <div
              key={brand.id}
              className="overflow-hidden rounded-[24px] border border-white/10 bg-black/20 transition-all duration-300"
              style={{ animationDelay: `${index * 90}ms` }}
            >
              <button
                type="button"
                onClick={() => toggleBrand(brand.id)}
                className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition hover:bg-white/5 md:px-5"
              >
                <div>
                  <p className="text-base font-extrabold uppercase tracking-[0.08em] text-white md:text-lg">
                    {brand.name}
                  </p>

                  {brand.subtitle && (
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-cyan-300/80">
                      {brand.subtitle}
                    </p>
                  )}
                </div>

                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-full border border-cyan-400/25 bg-cyan-400/10 text-cyan-300 transition duration-300 ${
                    isOpen
                      ? "rotate-180 shadow-[0_0_26px_rgba(34,211,238,0.35)]"
                      : ""
                  }`}
                >
                  <ChevronDown size={20} />
                </span>
              </button>

              <div
                className={`grid transition-all duration-500 ease-out ${
                  isOpen
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-70"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="space-y-3 border-t border-white/10 px-4 py-4 md:px-5">
                    {brand.items.map((item) => (
                      <article
                        key={item.id}
                        className="group rounded-[22px] border border-white/10 bg-white/[0.03] p-4 transition duration-300 hover:-translate-y-[1px] hover:border-cyan-400/25 hover:bg-white/[0.06]"
                      >
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                          <div className="min-w-0 flex-1">
                            <h3 className="truncate text-base font-bold text-white md:text-lg">
                              {item.name}
                            </h3>

                            <div className="mt-2 flex flex-wrap items-center gap-2">
                              {item.size && (
                                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/75">
                                  {item.size}
                                </span>
                              )}

                              <span className="rounded-full border border-fuchsia-400/20 bg-fuchsia-400/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-fuchsia-200">
                                Disponible
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between gap-3 md:justify-end">
                            <p className="menu-neon-price text-lg font-black tracking-[0.08em] text-cyan-300 md:text-xl">
                              {item.priceLabel || formatPrice(item.price)}
                            </p>

                            <button
                              type="button"
                              onClick={() => onAdd(item)}
                              className="inline-flex h-12 min-w-[52px] items-center justify-center rounded-2xl border border-cyan-400/25 bg-cyan-400/10 px-4 text-cyan-300 shadow-[0_0_24px_rgba(34,211,238,0.18)] transition duration-300 hover:scale-[1.03] hover:bg-cyan-400/20"
                              aria-label={`Agregar ${item.name} al carrito`}
                            >
                              <ShoppingCart size={19} />
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}