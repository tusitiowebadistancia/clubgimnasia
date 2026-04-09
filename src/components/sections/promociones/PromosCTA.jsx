import Reveal from "../../common/Reveal";

export default function PromosCTA() {
  return (
    <section className="bg-black px-4 py-20 text-center text-white">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <h2 className="mb-6 text-3xl md:text-4xl">
            Consultá qué promoción se adapta mejor a tu plan
          </h2>

          <p className="mb-8 text-zinc-400">
            Escribinos por WhatsApp y te contamos qué opción puede funcionar mejor para vos.
          </p>

          <a
            href="https://wa.me/542262589377?text=Hola%20quiero%20consultar%20por%20promociones"
            target="_blank"
            rel="noreferrer"
            className="inline-block rounded-xl bg-white px-6 py-3 font-semibold text-black transition hover:scale-105"
          >
            Consultar promociones
          </a>
        </Reveal>
      </div>
    </section>
  );
}