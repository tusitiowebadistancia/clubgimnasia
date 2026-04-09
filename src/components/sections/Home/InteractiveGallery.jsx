import Reveal from "../../common/Reveal";
import ImageSwapOnHold from "../../common/ImageSwapOnHold";

export default function InteractiveGallery() {
  return (
    <section className="bg-[#111] px-4 py-20 text-white">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="mb-12 text-center">
            <p className="mb-2 text-sm uppercase tracking-[0.3em] text-zinc-400">
              Experiencia visual
            </p>
            <h2 className="mb-4 text-3xl md:text-4xl">
              Viví el ambiente del club
            </h2>
            <p className="mx-auto max-w-2xl text-zinc-400">
              Mantené presionada la imagen para descubrir otra escena del espacio.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-8 md:grid-cols-2">
          <Reveal>
            <ImageSwapOnHold
              firstImage="https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200&auto=format&fit=crop"
              secondImage="https://images.unsplash.com/photo-1541534401786-2077eed87a72?q=80&w=1200&auto=format&fit=crop"
              alt="Bowling Club Gimnasia - experiencia"
              className="h-[420px]"
            />
          </Reveal>

          <Reveal>
            <div className="flex h-[420px] flex-col justify-center rounded-2xl bg-zinc-900 p-8">
              <h3 className="mb-4 text-2xl">Ideal para cumpleaños y reuniones</h3>
              <p className="mb-4 text-zinc-400">
                Mostrá el cambio de escena entre dos momentos del club: una vista
                más tranquila y otra con ambiente de evento. Esta interacción es
                simple, elegante y suma identidad sin complicar el desarrollo.
              </p>
              <p className="text-zinc-500">
                Después vamos a reemplazar estas imágenes por fotos reales del club.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}