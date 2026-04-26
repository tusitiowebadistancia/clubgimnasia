import Reveal from "../../common/Reveal";
import PrimaryButton from "../../common/PrimaryButton";

export default function ContactoWhatsApp() {
  return (
    <section className="bg-black px-4 py-20 text-center text-white">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <h2 className="mb-6 text-3xl md:text-4xl">
            Escribinos directo por WhatsApp
          </h2>

          <p className="mb-8 text-zinc-400">
            Si querés una respuesta rápida, este es el camino más directo.
          </p>

          <PrimaryButton
  href="https://wa.me/542262589377?text=Hola%2C%20quiero%20hacer%20una%20consulta%20sobre%20Bowling%20Club%20Gimnasia."
  target="_blank"
  rel="noreferrer"
>
  Hablar por WhatsApp
</PrimaryButton>
        </Reveal>
      </div>
    </section>
  );
}