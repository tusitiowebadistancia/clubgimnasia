import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const navLinks = [
  { to: "/", label: "Inicio" },
  { to: "/bowling-necochea", label: "Bowling" },
  { to: "/pool-necochea", label: "Pool" },
  { to: "/eventos-necochea", label: "Eventos" },
  //{ to: "/promociones", label: "Promociones" },
  { to: "/contacto", label: "Contacto" },
  { to: "/juegos", label: "Juegos" },
  { to: "/menu", label: "Menú" },
];

function getScoreColorClass(score) {
  if (score >= 1000) return "header-score-gold";
  if (score >= 500) return "header-score-white";
  if (score >= 200) return "header-score-cyan";
  if (score >= 100) return "header-score-red";
  if (score >= 50) return "header-score-orange";
  if (score >= 20) return "header-score-green";
  return "header-score-green";
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [balls, setBalls] = useState([]);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

  const brandRef = useRef(null);
  const iconRef = useRef(null);
  const inicioRef = useRef(null);
  const resetTimerRef = useRef(null);

  const location = useLocation();

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        window.clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  const spawnBall = () => {
  const brandEl = brandRef.current;
  const iconEl = iconRef.current;
  const inicioEl = inicioRef.current;

  if (!brandEl || !iconEl) return;

  const isMobile = window.innerWidth < 768;

  const startRect = brandEl.getBoundingClientRect();
  const targetRect =
    !isMobile && inicioEl
      ? inicioEl.getBoundingClientRect()
      : iconEl.getBoundingClientRect();

  const id = `${Date.now()}-${Math.random()}`;

  const startX = startRect.right - 8;
  const startY = startRect.top + startRect.height / 2;

  let targetX = targetRect.left + targetRect.width / 2;
  let targetY = targetRect.top + targetRect.height / 2;

  // En mobile la bola va hacia la derecha
  if (isMobile) {
    targetX = window.innerWidth - 42;
    targetY = startY;
  }

  const ball = {
    id,
    startX,
    startY,
    targetX,
    targetY,
    duration: isMobile ? 850 : 1100,
  };

  setBalls((prev) => [...prev, ball]);

  setScore((prev) => {
    const next = prev + 1;
    setShowScore(next > 5);
    return next;
  });

  if (resetTimerRef.current) {
    window.clearTimeout(resetTimerRef.current);
  }

  resetTimerRef.current = window.setTimeout(() => {
    setScore(0);
    setShowScore(false);
  }, 1000);

  window.setTimeout(() => {
    setBalls((prev) => prev.filter((item) => item.id !== id));
  }, ball.duration + 120);
};

  const scoreColorClass = getScoreColorClass(score);

  return (
    <>
      <header className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-black/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 text-white">
          <div className="relative flex items-center gap-4">
            <Link
              to="/"
              ref={iconRef}
              className="header-brand-icon-wrap shrink-0"
              aria-label="Ir al inicio"
            >
              <img
                src="/images/bowling-pin.png"
                alt="Ícono Club Gimnasia"
                className="h-10 w-auto object-contain md:h-12"
              />
            </Link>

            <button
              ref={brandRef}
              type="button"
              onMouseEnter={spawnBall}
              onClick={spawnBall}
              onTouchStart={spawnBall}
              className="header-brand-text relative text-left"
              aria-label="Club Gimnasia"
            >
              <span className="header-brand-club">Club</span>{" "}
              <span className="header-brand-gimnasia">Gimnasia</span>

              {showScore && (
                <span className={`header-score-badge ${scoreColorClass}`}>
                  +{score}
                </span>
              )}
            </button>
          </div>

          <nav className="hidden items-center gap-2 md:flex">
            {navLinks.map((item) => {
              const isActive = location.pathname === item.to;

              return (
                <Link
                  key={item.to}
                  ref={item.to === "/" ? inicioRef : undefined}
                  to={item.to}
                  className={`header-nav-link ${isActive ? "header-nav-link-active" : ""}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <button
            onClick={() => setOpen(true)}
            className="rounded-xl border border-white/10 bg-white/5 p-2 text-white transition hover:bg-white/10 md:hidden"
            aria-label="Abrir menú"
          >
            <Menu size={22} />
          </button>
        </div>

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {balls.map((ball) => (
            <FlyingBall key={ball.id} ball={ball} />
          ))}
        </div>
      </header>

      {/* menú lateral mobile debajo del header */}
      <div
        className={`fixed left-0 top-[0px] z-[80] h-[calc(100%-73px)] w-[82%] max-w-xs overflow-y-auto border-r border-white/10 bg-black text-white transition-transform duration-300 md:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-white/10 bg-black px-4 py-4">
          <span className="text-sm uppercase tracking-[0.25em] text-zinc-300">Menú</span>
          <button
            onClick={() => setOpen(false)}
            className="rounded-xl border border-white/10 bg-white/5 p-2 transition hover:bg-white/10"
            aria-label="Cerrar menú"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex flex-col gap-2 p-4">
          {navLinks.map((item) => {
            const isActive = location.pathname === item.to;

            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={`rounded-2xl px-4 py-3 text-lg transition ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-zinc-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[70] bg-black/55 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}

function FlyingBall({ ball }) {
  return (
    <div
      className="header-flying-ball"
      style={{
        left: `${ball.startX}px`,
        top: `${ball.startY}px`,
        ["--target-x"]: `${ball.targetX - ball.startX}px`,
        ["--target-y"]: `${ball.targetY - ball.startY}px`,
        ["--duration"]: `${ball.duration}ms`,
      }}
      aria-hidden="true"
    >
      <span className="header-flying-ball-shine" />
      <span className="header-flying-ball-hole hole-1" />
      <span className="header-flying-ball-hole hole-2" />
      <span className="header-flying-ball-hole hole-3" />
    </div>
  );
}