import Reveal from "../../common/Reveal";

const benefits = [
  "Una forma mucho más original de celebrar, lejos del festejo de siempre y con una experiencia que se siente distinta desde el primer momento.",
  "Más entretenimiento, más participación y más razones para que todos se involucren, se diviertan y disfruten de verdad.",
  "Un entorno recreativo que convierte el evento en un recuerdo más fuerte, más dinámico y mucho más valioso para quienes participan.",
  "Ideal para quienes buscan algo diferente: una celebración con ambiente, energía y momentos que realmente se recuerdan.",
];

export default function EventosBenefits() {
  return (
    <section className="bg-[#111] px-4 py-20 text-white">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <h2 className="mb-10 text-3xl md:text-4xl">
            Razones para elegir una celebración que realmente marque la diferencia
          </h2>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-2">
          {benefits.map((benefit) => (
            <Reveal key={benefit}>
              <div className="rounded-2xl border border-white/10 bg-zinc-900 p-6 text-zinc-300">
                {benefit}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}