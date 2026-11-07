import { useEffect, useRef } from "react";
import Reveal from "../../common/Reveal";

const items = [
  "Un espacio pensado para compartir una salida distinta con amigos, familia o esa persona con la que querés pasarla bien.",
  "Un ambiente cómodo, social y entretenido que invita a jugar, relajarte y quedarte más tiempo.",
  "La propuesta ideal para salidas espontáneas, festejos, reuniones y momentos que merecen algo más que un plan común.",
  "La posibilidad de combinar bowling con otras áreas del club para vivir una experiencia más completa en un solo lugar.",
];

export default function BowlingIncludes() {
  return (
    <section className="bowling-includes bg-[#111] px-4 py-20 text-white">
      <div className="bowling-includes-night mx-auto max-w-7xl">
        <Reveal>
          <h2 className="mb-10 text-3xl md:text-4xl">
            Mucho más que una pista: una experiencia para disfrutar de verdad
          </h2>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-2">
          {items.map((item) => (
            <Reveal key={item}>
              <div className="rounded-2xl border border-white/10 bg-zinc-900 p-6 text-zinc-300">
                {item}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
      <div className="bowling-includes-day mx-auto max-w-6xl items-center gap-10 md:grid-cols-[1.15fr_0.85fr]">
        <Reveal className="flex justify-center">
          <BowlingPinCharacters />
        </Reveal>
        <Reveal>
          <div className="max-w-xl text-center md:text-left">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-700">Plan con buena onda</p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight text-[#111111] md:text-5xl">Donde cada tiro suma a la noche</h2>
            <p className="mt-5 text-lg leading-relaxed text-[#333333]">Acá no venís solo a tirar una bola: venís a pasarla genial, reírte, competir un poco y quedarte con ganas de volver.</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const pinEyes = [{ x: 39, y: 117 }, { x: 61, y: 117 }];

function BowlingPinCharacters() {
  const charactersRef = useRef(null);
  const pinsRef = useRef([]);
  const pupilsRef = useRef([]);

  useEffect(() => {
    const characters = charactersRef.current;
    if (!characters) return undefined;
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let pointer = null;

    const reset = () => {
      pupilsRef.current.forEach((pupil) => {
        if (pupil) pupil.style.transform = "translate(0, 0)";
      });
    };

    const render = () => {
      frame = 0;
      if (!pointer) return;

      pupilsRef.current.forEach((pupil) => {
        if (!pupil) return;
        const pin = pinsRef.current[Number(pupil.dataset.pinIndex)];
        if (!pin) return;
        const bounds = pin.getBoundingClientRect();
        const eye = pinEyes[Number(pupil.dataset.eyeIndex)];
        const targetX = ((pointer.x - bounds.left) / bounds.width) * 100;
        const targetY = ((pointer.y - bounds.top) / bounds.height) * 210;
        const deltaX = targetX - eye.x;
        const deltaY = targetY - eye.y;
        const distance = Math.hypot(deltaX, deltaY) || 1;
        const offset = Math.min(4.5, distance * 0.1);
        pupil.style.transform = `translate(${(deltaX / distance) * offset * (bounds.width / 100)}px, ${(deltaY / distance) * offset * (bounds.height / 210)}px)`;
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

    characters.addEventListener("pointermove", handleMove);
    characters.addEventListener("pointerleave", handleLeave);
    window.addEventListener("blur", handleLeave);
    motionPreference.addEventListener("change", handleMotionChange);

    return () => {
      characters.removeEventListener("pointermove", handleMove);
      characters.removeEventListener("pointerleave", handleLeave);
      window.removeEventListener("blur", handleLeave);
      motionPreference.removeEventListener("change", handleMotionChange);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return <div ref={charactersRef} className="bowling-pin-characters" aria-label="Tres pinos de bowling sonrientes">
    {["uno", "dos", "tres"].map((pin, pinIndex) => <svg key={pin} ref={(element) => { pinsRef.current[pinIndex] = element; }} viewBox="0 0 100 210" className={`bowling-pin-character bowling-pin-character-${pinIndex + 1}`} role="img" aria-label={`Pino de bowling sonriente ${pinIndex + 1}`}>
      <path d="M50 8 C31 8 29 31 36 48 C40 57 35 68 26 83 C15 102 10 132 14 163 C18 190 31 203 50 203 C69 203 82 190 86 163 C90 132 85 102 74 83 C65 68 60 57 64 48 C71 31 69 8 50 8 Z" fill="#fdfdfb" stroke="#d7e1e6" strokeWidth="2" />
      <path d="M34 49 H66" stroke="#e11d48" strokeWidth="10" strokeLinecap="round" />
      <path d="M31 64 H69" stroke="#e11d48" strokeWidth="7" strokeLinecap="round" />
      <g className="bowling-pin-eyes">
        {pinEyes.map((eye, eyeIndex) => <g key={eye.x}>
          <ellipse cx={eye.x} cy={eye.y} rx="12" ry="15" fill="#ffffff" stroke="#b8c8d1" strokeWidth="1.5" />
          <circle ref={(element) => { pupilsRef.current[pinIndex * 2 + eyeIndex] = element; }} data-pin-index={pinIndex} data-eye-index={eyeIndex} className="bowling-pin-pupil" cx={eye.x} cy={eye.y} r="4.5" fill="#111111" />
        </g>)}
      </g>
      <path d="M35 151 Q50 167 65 151" fill="none" stroke="#d94662" strokeWidth="4" strokeLinecap="round" />
      <path d="M26 175 Q50 191 74 175" fill="none" stroke="#d7e1e6" strokeWidth="2" opacity="0.55" />
    </svg>)}
  </div>;
}
