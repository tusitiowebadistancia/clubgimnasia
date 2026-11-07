import { useEffect, useRef } from "react";
import Reveal from "../../common/Reveal";
import SectionTitle from "../../common/SectionTitle";

const mascotEyes = [{ x: 116, y: 108 }, { x: 184, y: 108 }];

export default function ExperienceSection() {
  return (
    <section className="experience-section bg-black/35 px-4 py-20 text-white backdrop-blur-[2px]">
      <div className="experience-night mx-auto grid max-w-7xl gap-10 md:grid-cols-2 md:items-center">
        <Reveal>
          <SectionTitle
            eyebrow="La experiencia"
            title="Un lugar pensado para disfrutar, compartir y volver"
            description="En Bowling Club Gimnasia no venís solo a jugar: venís a vivir una salida completa, con ambiente, entretenimiento y momentos que valen la pena."
          />
        </Reveal>

        <Reveal>
          <div className="rounded-3xl border border-white/10 bg-zinc-900/65 p-8 backdrop-blur-sm">
            <p className="mb-4 text-zinc-300">
              Cada visita está pensada para que la pases bien desde que entrás hasta que te vas.
              Ya sea una salida con amigos, un plan en pareja, una reunión familiar o una noche distinta,
              el club combina diversión, comodidad y un entorno que invita a quedarse más tiempo.
            </p>
            <p className="text-zinc-400">
              Por eso esta experiencia no se resume en una pista o una mesa: se trata de encontrar un lugar
              donde jugar, relajarte, compartir y crear recuerdos que te den ganas de volver.
            </p>
          </div>
        </Reveal>
      </div>

      <div className="experience-day mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <Reveal className="flex justify-center">
          <BowlingMascot />
        </Reveal>

        <Reveal>
          <div className="max-w-xl text-center md:text-left">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-700">El club, más cerca</p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight text-[#111111] md:text-5xl">Seguinos para no perderte ninguna jugada</h2>
            <p className="mt-5 text-base leading-relaxed text-[#333333] md:text-lg">Detrás de cada partida hay momentos para compartir. Encontrá novedades, escenas del club y un poco de la energía que se vive en cada noche.</p>
            <a href="https://instagram.com/bowlingimnasia" target="_blank" rel="noreferrer" className="mascot-instagram-link mt-7">
              <InstagramMark />
              Seguinos en Instagram
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function InstagramMark() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function BowlingMascot() {
  const ballRef = useRef(null);
  const pupilsRef = useRef([]);

  useEffect(() => {
    const ball = ballRef.current;
    if (!ball) return undefined;

    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let pointer = null;

    const reset = () => {
      pupilsRef.current.forEach((pupil, index) => {
        pupil?.setAttribute("cx", String(mascotEyes[index].x));
        pupil?.setAttribute("cy", String(mascotEyes[index].y));
      });
    };

    const render = () => {
      frame = 0;
      if (!pointer) return;
      const bounds = ball.getBoundingClientRect();
      const x = ((pointer.x - bounds.left) / bounds.width) * 300;
      const y = ((pointer.y - bounds.top) / bounds.height) * 300;

      pupilsRef.current.forEach((pupil, index) => {
        if (!pupil) return;
        const deltaX = x - mascotEyes[index].x;
        const deltaY = y - mascotEyes[index].y;
        const distance = Math.hypot(deltaX, deltaY) || 1;
        const offset = Math.min(8, distance * 0.12);
        pupil.setAttribute("cx", String(mascotEyes[index].x + (deltaX / distance) * offset));
        pupil.setAttribute("cy", String(mascotEyes[index].y + (deltaY / distance) * offset));
      });
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(render);
    };

    const handleMove = (event) => {
      if (motionPreference.matches || event.pointerType === "touch") {
        pointer = null;
        reset();
        return;
      }
      pointer = { x: event.clientX, y: event.clientY };
      schedule();
    };

    const handleLeave = () => {
      pointer = null;
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      reset();
    };

    const handleMotionChange = () => {
      if (motionPreference.matches) handleLeave();
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("blur", handleLeave);
    motionPreference.addEventListener("change", handleMotionChange);
    reset();

    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("blur", handleLeave);
      motionPreference.removeEventListener("change", handleMotionChange);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <svg ref={ballRef} viewBox="0 0 300 300" className="bowling-mascot" role="img" aria-label="Mascota: una bola de bowling sonriente">
      <defs>
        <radialGradient id="mascot-ball" cx="32%" cy="24%" r="75%">
          <stop offset="0%" stopColor="#8ed8ff" />
          <stop offset="38%" stopColor="#2496d3" />
          <stop offset="78%" stopColor="#075b95" />
          <stop offset="100%" stopColor="#043b68" />
        </radialGradient>
        <filter id="mascot-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="12" stdDeviation="10" floodColor="#063d66" floodOpacity="0.25" />
        </filter>
      </defs>
      <circle cx="150" cy="150" r="132" fill="url(#mascot-ball)" filter="url(#mascot-shadow)" />
      <circle cx="114" cy="197" r="15" fill="#063957" />
      <circle cx="181" cy="190" r="15" fill="#063957" />
      <circle cx="153" cy="229" r="15" fill="#063957" />
      <ellipse cx="116" cy="108" rx="22" ry="27" fill="#f9fcff" />
      <ellipse cx="184" cy="108" rx="22" ry="27" fill="#f9fcff" />
      {mascotEyes.map((eye, index) => <circle key={eye.x} ref={(element) => { pupilsRef.current[index] = element; }} cx={eye.x} cy={eye.y} r="7" fill="#111111" />)}
      <path d="M112 150 Q150 184 188 150" fill="none" stroke="#f9fcff" strokeLinecap="round" strokeWidth="9" />
      <path d="M112 150 Q150 184 188 150" fill="none" stroke="#06436e" strokeLinecap="round" strokeWidth="4" />
      <ellipse cx="106" cy="64" rx="29" ry="13" fill="#ffffff" opacity="0.24" transform="rotate(-28 106 64)" />
    </svg>
  );
}
