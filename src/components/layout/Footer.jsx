import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black px-4 py-14 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-4">
        
        {/* Marca */}
        <div>
          <h3 className="mb-4 text-xl font-semibold">Bowling Club Gimnasia</h3>
          <p className="text-sm text-zinc-400">
            Un espacio pensado para disfrutar bowling, pool, eventos y buenos momentos en Necochea.
          </p>
        </div>

        {/* Navegación */}
        <div>
          <h4 className="mb-4 text-lg">Navegación</h4>
          <ul className="space-y-2 text-sm text-zinc-400">
            <li><Link to="/" className="transition hover:text-white">Inicio</Link></li>
            <li><Link to="/bowling-necochea" className="transition hover:text-white">Bowling</Link></li>
            <li><Link to="/pool-necochea" className="transition hover:text-white">Pool</Link></li>
            <li><Link to="/eventos-necochea" className="transition hover:text-white">Eventos</Link></li>
            <li><Link to="/promociones" className="transition hover:text-white">Promociones</Link></li>
            <li><Link to="/contacto" className="transition hover:text-white">Contacto</Link></li>
          </ul>
        </div>

        {/* Contacto */}
        <div>
          <h4 className="mb-4 text-lg">Contacto</h4>
          <ul className="space-y-2 text-sm text-zinc-400">
            <li>Necochea, Buenos Aires</li>
            <li>WhatsApp: 2262 58-9377</li>
            <li>Horario: a definir</li>
          </ul>
        </div>

        {/* CTA */}
        <div>
          <h4 className="mb-4 text-lg">Reservas</h4>
          <p className="mb-4 text-sm text-zinc-400">
            Consultá disponibilidad o escribinos directo para reservar.
          </p>
          <a
            href="https://wa.me/542262589377?text=Hola%20quiero%20reservar"
            target="_blank"
            rel="noreferrer"
            className="inline-block rounded-xl bg-white px-5 py-3 font-semibold text-black transition hover:scale-105"
          >
            Reservar por WhatsApp
          </a>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 pt-6 text-center text-sm text-zinc-500">
        © {new Date().getFullYear()} Bowling Club Gimnasia. Todos los derechos reservados.
      </div>
    </footer>
  );
}