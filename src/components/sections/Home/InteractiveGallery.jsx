import { useState } from "react";
import Reveal from "../../common/Reveal";

export default function InteractiveGallery() {
  const [showSecondImage, setShowSecondImage] = useState(false);

  const handleImageClick = () => {
    setShowSecondImage((prev) => !prev);
  };

  return (
    <section className="bg-[#111] px-4 py-20 text-white">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="mb-12 text-center">
            <p className="mb-2 text-sm uppercase tracking-[0.3em] text-zinc-400">
              Nosotros
            </p>

            <h2 className="mb-4 text-3xl md:text-4xl">
              ¿Quienes somos?
            </h2>

            <p className="mx-auto max-w-2xl text-zinc-400">
              
            </p>
          </div>
        </Reveal>

        <div className="grid gap-8 md:grid-cols-2">
          <Reveal>
            <button
              type="button"
              onClick={handleImageClick}
              className="group relative block h-[420px] w-full overflow-hidden rounded-2xl bg-black p-4 text-left md:p-6"
              aria-label="Cambiar imagen"
            >
              <img
                src="/images/bowling-logo-azul-1024.png"
                alt="Bowling Club Gimnasia - experiencia"
                draggable="false"
                className={`absolute inset-0 h-full w-full object-contain p-4 transition-all duration-700 md:p-6 ${
                  showSecondImage
                    ? "opacity-0 scale-95"
                    : "opacity-100 scale-100"
                }`}
              />

              <img
                src="/images/bowling-logo-gris-1024.png"
                alt="Bowling Club Gimnasia - experiencia"
                draggable="false"
                className={`absolute inset-0 h-full w-full object-contain p-4 transition-all duration-700 md:p-6 ${
                  showSecondImage
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-95"
                }`}
              />

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10" />
            </button>
          </Reveal>

          <Reveal>
            <div className="flex h-[420px] flex-col justify-center rounded-2xl bg-zinc-900 p-8">
              <h3 className="mb-4 text-2xl">
                Una familia con 25 años de historia.
              </h3>

              <p className="mb-4 text-zinc-400">
                
  Por este lugar pasaron grandes jugadores, torneos inolvidables, amigos,
  familias y momentos que quedaron guardados en la historia del bowling en Necochea.
              </p>

              <p className="text-zinc-500">
                
  Seguimos creciendo con la misma pasión de siempre, para que este espacio se sienta
  tanto nuestro como de ustedes.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}