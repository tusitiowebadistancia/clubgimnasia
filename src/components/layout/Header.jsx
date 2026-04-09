import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* HEADER */}
      <header className="fixed top-0 left-0 z-50 w-full bg-black/70 backdrop-blur-md border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 text-white">

          {/* LOGO */}
          <Link to="/" className="text-lg font-semibold tracking-wide">
            Club Gimnasia
          </Link>

          {/* BOTÓN MOBILE */}
          <button onClick={() => setOpen(true)} className="md:hidden">
            <Menu />
          </button>

          {/* MENU DESKTOP */}
          <nav className="hidden md:flex gap-6 text-sm">
            <Link to="/">Inicio</Link>
            <Link to="/bowling-necochea">Bowling</Link>
            <Link to="/pool-necochea">Pool</Link>
            <Link to="/eventos-necochea">Eventos</Link>
            <Link to="/promociones">Promociones</Link>
            <Link to="/contacto">Contacto</Link>
          </nav>
        </div>
      </header>

      {/* MENU LATERAL MOBILE */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-[80%] max-w-xs bg-black text-white transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <span>Menú</span>
          <button onClick={() => setOpen(false)}>
            <X />
          </button>
        </div>

        <nav className="flex flex-col gap-4 p-6 text-lg">
          <Link onClick={() => setOpen(false)} to="/">Inicio</Link>
          <Link onClick={() => setOpen(false)} to="/bowling-necochea">Bowling</Link>
          <Link onClick={() => setOpen(false)} to="/pool-necochea">Pool</Link>
          <Link onClick={() => setOpen(false)} to="/eventos-necochea">Eventos</Link>
          <Link onClick={() => setOpen(false)} to="/promociones">Promociones</Link>
          <Link onClick={() => setOpen(false)} to="/contacto">Contacto</Link>
        </nav>
      </div>

      {/* OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}