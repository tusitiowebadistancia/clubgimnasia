import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function BowlingCarousel3D({ images = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const total = images.length;
  const angleStep = total > 0 ? 360 / total : 0;

  const rotateLeft = () => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  const rotateRight = () => {
    setActiveIndex((prev) => (prev + 1) % total);
  };

  const carouselRotation = useMemo(() => {
    return -(activeIndex * angleStep);
  }, [activeIndex, angleStep]);

  return (
    <div className="relative mx-auto flex h-[620px] w-full items-center justify-center overflow-hidden [perspective:1400px]">
      {/* pino central */}
      <div className="pointer-events-none absolute z-0 flex items-center justify-center">
        <div className="relative flex items-center justify-center">
          {/* llama */}
          {/* llama */}
<div className="absolute -top-4 z-10 md:-top-6">
  <div className="flame-wrap relative h-8 w-5 md:h-10 md:w-6">
    <div className="flame-glow absolute inset-0 rounded-full bg-orange-500/60 blur-[10px]" />
    <div className="flame-outer absolute left-1/2 top-0 h-8 w-5 -translate-x-1/2 rounded-[60%_60%_70%_70%/80%_80%_50%_50%] bg-gradient-to-t from-orange-600 via-orange-400 to-yellow-200 md:h-10 md:w-6" />
    <div className="flame-inner absolute left-1/2 top-2 h-4 w-2.5 -translate-x-1/2 rounded-[60%_60%_70%_70%/80%_80%_50%_50%] bg-gradient-to-t from-yellow-300 via-yellow-100 to-white md:h-5 md:w-3" />
  </div>
</div>

          <img
            src="/images/bowling-pin.png"
            alt="Pino de bowling"
            className="h-40 w-auto object-contain opacity-90 drop-shadow-[0_0_20px_rgba(255,255,255,0.08)] md:h-56"
          />
        </div>
      </div>

      {/* carrusel */}
      <div
        className="relative h-[380px] w-[380px] transition-transform duration-700 ease-in-out [transform-style:preserve-3d] md:h-[460px] md:w-[460px]"
        style={{
          transform: `rotateY(${carouselRotation}deg)`,
        }}
      >
        {images.map((image, index) => {
          const angle = index * angleStep;

          return (
            <div
              key={index}
              className="absolute left-1/2 top-1/2 h-48 w-72 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/70 shadow-2xl backdrop-blur-sm md:h-56 md:w-80"
              style={{
                transform: `rotateY(${angle}deg) translateZ(380px)`,
              }}
            >
              <img
                src={image}
                alt={`Galería ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </div>
          );
        })}
      </div>

      {/* flechas */}
      <button
        onClick={rotateLeft}
        className="absolute left-2 z-30 rounded-full border border-white/10 bg-black/50 p-3 text-white backdrop-blur-sm transition hover:scale-105 md:left-10"
        aria-label="Anterior"
      >
        <ChevronLeft />
      </button>

      <button
        onClick={rotateRight}
        className="absolute right-2 z-30 rounded-full border border-white/10 bg-black/50 p-3 text-white backdrop-blur-sm transition hover:scale-105 md:right-10"
        aria-label="Siguiente"
      >
        <ChevronRight />
      </button>
    </div>
  );
}