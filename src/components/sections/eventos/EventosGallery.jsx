import Reveal from "../../common/Reveal";
import ImageSwapOnHold from "../../common/ImageSwapOnHold";

export default function EventosGallery() {
  return (
    <section className="bg-black px-4 py-20 text-white">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl md:text-4xl">Fotos de eventos</h2>
            <p className="mx-auto max-w-2xl text-zinc-400">
              Mantené presionada la imagen para ver otra escena del espacio y proyectar
              cómo se vive un evento en el club.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-8 md:grid-cols-2">
          <Reveal>
            <ImageSwapOnHold
              firstImage="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=1200&auto=format&fit=crop"
              secondImage="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop"
              alt="Eventos Bowling Club Gimnasia"
              className="h-[420px]"
            />
          </Reveal>

          <Reveal>
            <div className="flex h-[420px] flex-col justify-center rounded-2xl bg-[#111] p-8">
              <h3 className="mb-4 text-2xl">Una propuesta flexible y memorable</h3>
              <p className="mb-4 text-zinc-400">
                Esta sección está pensada para mostrar cómo el espacio puede adaptarse
                a festejos, cumpleaños y reuniones, reforzando visualmente la idea de experiencia.
              </p>
              <p className="text-zinc-500">
                Más adelante reemplazamos estas imágenes por fotos reales del club.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}