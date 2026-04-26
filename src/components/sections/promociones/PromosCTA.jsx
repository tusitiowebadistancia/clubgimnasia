import Reveal from "../../common/Reveal";
import PrimaryButton from "../../common/PrimaryButton";

export default function PromosCTA() {
  return (
    <section className="bg-black px-4 py-20 text-center text-white">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <h2 className="mb-6 text-3xl md:text-4xl">
            Consultá qué promoción se adapta mejor a tu plan
          </h2>

          <p className="mb-8 text-zinc-400">
  Escribinos por WhatsApp y te contamos qué promoción puede ajustarse mejor a tu salida, evento o grupo.
</p>

          <PrimaryButton
  href="https://wa.me/542262589377?text=Hola%2C%20quiero%20consultar%20por%20las%20promociones%20de%20Bowling%20Club%20Gimnasia."
  target="_blank"
  rel="noreferrer"
>
  Consultar promociones
</PrimaryButton>
        </Reveal>
      </div>
    </section>
  );
}