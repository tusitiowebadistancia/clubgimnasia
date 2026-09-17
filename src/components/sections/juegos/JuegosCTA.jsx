import Reveal from "../../common/Reveal";
import PrimaryButton from "../../common/PrimaryButton";

export default function JuegosCTA() {
  return (
    <section className="bg-black px-4 py-20 text-center text-white">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <h2 className="mb-6 text-3xl md:text-4xl">
            ¿Querés sumar más experiencias al club?
          </h2>

          <p className="mb-8 text-zinc-400">
            Esta sección puede crecer con nuevos juegos, reglas, anotadores y dinámicas.
          </p>

          <PrimaryButton
            href="https://wa.me/542262589377?text=Hola%2C%20quiero%20consultar%20por%20las%20secciones%20de%20juegos%20del%20club."
            target="_blank"
            rel="noreferrer"
          >
            Consultar por WhatsApp
          </PrimaryButton>
        </Reveal>
      </div>
    </section>
  );
}