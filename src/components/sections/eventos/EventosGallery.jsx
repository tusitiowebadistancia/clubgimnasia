import Reveal from "../../common/Reveal";
import ImageSwapOnHold from "../../common/ImageSwapOnHold";

export default function EventosGallery() {
  return (
    <section className="bg-black px-4 py-20 text-white">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl md:text-4xl">
              Imaginá tu próximo evento acá
            </h2>
            <p className="mx-auto max-w-2xl text-zinc-400">
              Mantené presionada la imagen y descubrí distintas escenas del espacio.
              Una forma simple de proyectar cómo se puede vivir un cumpleaños, una reunión
              o una celebración dentro del club.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-8 md:grid-cols-2">
          <Reveal>
            <ImageSwapOnHold
              firstImage="/images/cumpleaños.png"
              secondImage="/images/3cumpleaños.png"
              alt="Eventos Bowling Club Gimnasia"
              className="h-[420px]"
            />
          </Reveal>

          <Reveal>
            <div className="flex h-[420px] flex-col justify-center rounded-2xl bg-[#111] p-8">
              <h3 className="mb-4 text-2xl">
                Un espacio que se adapta al momento que querés crear
              </h3>
              <p className="mb-4 text-zinc-400">
                Desde cumpleaños y festejos hasta reuniones más distendidas, el club ofrece
                el ambiente ideal para transformar una simple salida en un momento mucho más
                especial, dinámico y recordable.
              </p>
              <p className="text-zinc-500">
                Cada imagen ayuda a imaginar la energía del lugar y todo lo que puede pasar
                cuando el evento se vive en el espacio correcto.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}