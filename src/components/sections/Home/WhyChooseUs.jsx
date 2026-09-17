import Reveal from "../../common/Reveal";
import SectionTitle from "../../common/SectionTitle";

const reasons = [
  "Un ambiente pensado para disfrutar, relajarte y compartir un buen momento.",
  "Una propuesta diferente en Necochea para salir de la rutina y vivir algo más entretenido.",
  "Opciones para bowling, pool, cumpleaños, reuniones y planes grupales en un mismo lugar.",
  "Contacto rápido por WhatsApp para consultar, reservar y resolver todo de forma simple.",
];

export default function WhyChooseUs() {
  return (
    <section className="bg-black/35 px-4 py-20 text-white backdrop-blur-[2px]">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionTitle
            eyebrow="¿Por qué elegirnos?"
            title="Razones para elegir una salida que realmente valga la pena"
            description="Cuando buscás un lugar para jugar, compartir y pasarla bien, lo importante no es solo lo que ofrece, sino cómo te hace sentir desde que llegás."
          />
        </Reveal>

        <div className="grid gap-6 md:grid-cols-2">
          {reasons.map((reason) => (
            <Reveal key={reason}>
              <div className="rounded-2xl border border-white/10 bg-zinc-900/65 p-6 text-zinc-300 backdrop-blur-sm">
                {reason}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}