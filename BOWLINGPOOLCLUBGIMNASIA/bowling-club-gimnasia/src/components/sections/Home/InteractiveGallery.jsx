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
              Sentí el ambiente antes de venir
            </h2>
            <p className="mx-auto max-w-2xl text-zinc-400">
              Mantené presionada la imagen y descubrí y descubri los diferentes espacios.
              De una salida tranquila a un ambiente lleno de energía.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-8 md:grid-cols-2">
          <Reveal>
            <ImageSwapOnHold
              firstImage="/images/cumpleaños.png"
              secondImage="/images/carruselbow5.jpeg"
              alt="Bowling Club Gimnasia - experiencia"
              className="h-[420px]"
            />
          </Reveal>

          <Reveal>
            <div className="flex h-[420px] flex-col justify-center rounded-2xl bg-zinc-900 p-8">
              <h3 className="mb-4 text-2xl">
                Un mismo lugar, distintas experiencias
              </h3>
              <p className="mb-4 text-zinc-400">
                Durante el día podés encontrar un espacio relajado para disfrutar tranquilo.
                Por la noche, el ambiente cambia: luces, energía y una experiencia mucho más dinámica.
              </p>
              <p className="text-zinc-500">
                Ya sea un cumpleaños, una previa o una salida espontánea, el club se adapta
                para que cada momento se sienta único.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}