import Reveal from "../../common/Reveal";

export default function ContactoMap() {
  return (
    <section className="bg-black px-4 py-20 text-white">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <h2 className="mb-10 text-3xl md:text-4xl">Ubicación</h2>
        </Reveal>

        <Reveal>
          <div className="overflow-hidden rounded-2xl border border-white/10">
            <iframe
              title="Mapa Bowling Club Gimnasia"
              src="https://www.google.com/maps?q=Calle+67+3049+Necochea+Buenos+Aires&z=16&output=embed"
              width="100%"
              height="420"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}