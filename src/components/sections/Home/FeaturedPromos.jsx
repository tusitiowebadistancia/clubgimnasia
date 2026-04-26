import Reveal from "../../common/Reveal";
import SectionTitle from "../../common/SectionTitle";

const promos = [
  {
    title: "Promociones para grupos",
    text: "Ideal para organizar una salida con amigos y aprovechar una propuesta pensada para compartir más, disfrutar mejor y vivir una experiencia distinta en el club.",
  },
  {
    title: "Propuestas para cumpleaños",
    text: "Convertí un festejo común en un momento mucho más divertido, dinámico y memorable con una experiencia que combina juego, ambiente y celebración.",
  },
  {
    title: "Consultas rápidas por WhatsApp",
    text: "Resolvé dudas, consultá disponibilidad y avanzá con tu reserva de forma simple, directa y sin vueltas desde el celular.",
  },
];

export default function FeaturedPromos() {
  return (
    <section className="bg-white/[0.03] px-4 py-20 text-white backdrop-blur-[2px]">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionTitle
            eyebrow="Promociones"
            title="Opciones pensadas para vos"
            description="Desde salidas con amigos hasta cumpleaños y consultas rápidas, cada propuesta está pensada para facilitar la decisión y acercarte más rápido a la experiencia."
            centered
          />
        </Reveal>

        <div className="grid gap-8 md:grid-cols-3">
          {promos.map((promo) => (
            <Reveal key={promo.title}>
              <div className="rounded-2xl border border-white/10 bg-zinc-900/65 p-8 backdrop-blur-sm">
                <h3 className="mb-4 text-2xl">{promo.title}</h3>
                <p className="text-zinc-400">{promo.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}