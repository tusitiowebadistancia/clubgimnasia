import { useState } from "react";
import Reveal from "../../common/Reveal";
import { buildWhatsAppUrl } from "../../../utils/whatsapp";

export default function ContactoForm() {
  const [form, setForm] = useState({
    nombre: "",
    servicio: "",
    fecha: "",
    personas: "",
    mensaje: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const message = `
Hola, quiero hacer una consulta en Bowling Club Gimnasia.
Nombre: ${form.nombre}
Servicio: ${form.servicio}
Fecha estimada: ${form.fecha}
Cantidad de personas: ${form.personas}
Mensaje: ${form.mensaje}
    `.trim();

    window.open(buildWhatsAppUrl(message), "_blank");
  };

  return (
    <section className="bg-[#111] px-4 py-20 text-white">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <h2 className="mb-10 text-3xl md:text-4xl text-center">
            Formulario de contacto
          </h2>
        </Reveal>

        <Reveal>
          <form
            onSubmit={handleSubmit}
            className="grid gap-5 rounded-2xl border border-white/10 bg-zinc-900 p-8"
          >
            <input
              type="text"
              name="nombre"
              placeholder="Tu nombre"
              value={form.nombre}
              onChange={handleChange}
              className="rounded-xl bg-black px-4 py-3 text-white outline-none"
              required
            />

            <select
              name="servicio"
              value={form.servicio}
              onChange={handleChange}
              className="rounded-xl bg-black px-4 py-3 text-white outline-none"
              required
            >
              <option value="">Seleccioná un servicio</option>
              <option value="Bowling">Bowling</option>
              <option value="Pool">Pool</option>
              <option value="Evento">Evento</option>
              <option value="Promoción">Promoción</option>
            </select>

            <input
              type="date"
              name="fecha"
              value={form.fecha}
              onChange={handleChange}
              className="rounded-xl bg-black px-4 py-3 text-white outline-none"
            />

            <input
              type="number"
              name="personas"
              placeholder="Cantidad de personas"
              value={form.personas}
              onChange={handleChange}
              className="rounded-xl bg-black px-4 py-3 text-white outline-none"
            />

            <textarea
              name="mensaje"
              placeholder="Contanos un poco más"
              value={form.mensaje}
              onChange={handleChange}
              rows="5"
              className="rounded-xl bg-black px-4 py-3 text-white outline-none"
            />

            <button
              type="submit"
              className="rounded-xl bg-white px-6 py-3 font-semibold text-black transition hover:scale-[1.02]"
            >
              Enviar por WhatsApp
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}