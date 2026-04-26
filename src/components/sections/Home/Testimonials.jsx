import Reveal from "../../common/Reveal";
import SectionTitle from "../../common/SectionTitle";

const testimonials = [
  {
    name: "Celina P.",
    text: "Excelente lugar para disfrutar de una buena noche de pool y/o bowling. Buena atención y muy buena onda.",
  },
  {
    name: "Agustina T.",
    text: "Promete y cumple. Fuimos a las 2 am, había gente, jugamos re tranquilos y nos pareció un muy buen precio.",
  },
  {
    name: "Tomas P.",
    text: "!Buena música y excelente atención¡ Volvere",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-white/[0.03] px-4 py-20 text-white backdrop-blur-[2px]">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionTitle
            eyebrow="Testimonios"
            title="Lo que dicen quienes ya vivieron la experiencia"
            description="Cuando un lugar realmente cumple, se nota en cómo lo cuenta la gente. Estas opiniones refuerzan la confianza y muestran lo que se vive dentro del club."
            centered
          />
        </Reveal>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((item) => (
            <Reveal key={item.name}>
              <div className="rounded-2xl border border-white/10 bg-zinc-900/65 p-8 backdrop-blur-sm">
                <p className="mb-6 text-zinc-300">“{item.text}”</p>
                <span className="text-sm uppercase tracking-[0.2em] text-zinc-500">
                  {item.name}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}