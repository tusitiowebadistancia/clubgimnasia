import Reveal from "../../common/Reveal";

const condiciones = [
  "Las promociones están sujetas a disponibilidad.",
  "Algunas propuestas pueden aplicar en días y horarios específicos.",
  "La información definitiva se confirma al momento de la consulta.",
];

export default function PromosCondiciones() {
  return (
    <section className="bg-[#111] px-4 py-20 text-white">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <h2 className="mb-10 text-3xl md:text-4xl">Condiciones generales</h2>
        </Reveal>

        <div className="space-y-4">
          {condiciones.map((condicion) => (
            <Reveal key={condicion}>
              <div className="rounded-2xl border border-white/10 bg-zinc-900 p-6 text-zinc-300">
                {condicion}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}