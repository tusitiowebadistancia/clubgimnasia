import { useEffect, useRef, useState } from "react";
import Reveal from "../../common/Reveal";

const PIN_COUNT = 9;

function createPin(id) {
  return {
    id,
    left: 7 + Math.random() * 86,
    duration: 6.5 + Math.random() * 3.5,
    delay: -Math.random() * 7,
    rotation: -18 + Math.random() * 36,
    hit: false,
  };
}

export default function EventosGallery() {
  const nextId = useRef(PIN_COUNT);
  const timeouts = useRef(new Set());
  const roundTimers = useRef(new Set());
  const roundVersion = useRef(0);
  const hitIds = useRef(new Set());
  const [pins, setPins] = useState(() => Array.from({ length: PIN_COUNT }, (_, id) => createPin(id)));
  const [score, setScore] = useState(0);
  const [remaining, setRemaining] = useState(null);

  useEffect(() => () => {
    timeouts.current.forEach((timeout) => window.clearTimeout(timeout));
    roundTimers.current.forEach((timeout) => window.clearTimeout(timeout));
  }, []);

  function replacePin(id) {
    hitIds.current.delete(id);
    setPins((current) => current.map((pin) => pin.id === id ? createPin(nextId.current++) : pin));
  }

  function restartRoundTimer() {
    const version = ++roundVersion.current;
    roundTimers.current.forEach((timeout) => window.clearTimeout(timeout));
    roundTimers.current.clear();
    setRemaining(3);

    [2, 1].forEach((seconds) => {
      const timeout = window.setTimeout(() => {
        roundTimers.current.delete(timeout);
        if (version !== roundVersion.current) return;
        setRemaining(seconds);
      }, (3 - seconds) * 1000);
      roundTimers.current.add(timeout);
    });

    const timeout = window.setTimeout(() => {
      roundTimers.current.delete(timeout);
      if (version !== roundVersion.current) return;
      setScore(0);
      setRemaining(null);
    }, 3000);
    roundTimers.current.add(timeout);
  }

  function hitPin(id) {
    if (hitIds.current.has(id)) return;
    hitIds.current.add(id);
    setPins((current) => current.map((pin) => pin.id === id ? { ...pin, hit: true } : pin));
    setScore((current) => current + 1);
    restartRoundTimer();
    const timeout = window.setTimeout(() => {
      timeouts.current.delete(timeout);
      replacePin(id);
    }, 650);
    timeouts.current.add(timeout);
  }

  return (
    <section className="event-pins-section bg-black px-4 py-20 text-white">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300">Eventos con energía</p>
            <h2 className="mt-4 text-3xl md:text-4xl">Los mejores eventos no se imaginan, se viven</h2>
          </div>
        </Reveal>

        <Reveal>
          <div className="event-pins-stage">
            <div className="event-pins-rain" aria-label="Lluvia interactiva de pinos de bowling">
              {pins.map((pin) => <FallingPin key={pin.id} pin={pin} onFallEnd={replacePin} onHit={hitPin} />)}
            </div>
            <div className="event-pins-score" aria-live="polite">
              <span>Puntos: {score}</span>
              {remaining !== null && <small>Racha: {remaining}s</small>}
            </div>
            <div className="event-pins-message">
              <a href="https://instagram.com/bowlingimnasia" target="_blank" rel="noopener noreferrer" className="event-pins-instagram">
                <InstagramMark />
                Seguinos en Instagram
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function InstagramMark() {
  return <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>;
}

function FallingPin({ pin, onFallEnd, onHit }) {
  const style = {
    "--pin-left": `${pin.left}%`,
    "--pin-duration": `${pin.duration}s`,
    "--pin-delay": `${pin.delay}s`,
    "--pin-rotation": `${pin.rotation}deg`,
  };

  return (
    <button
      type="button"
      className={`event-falling-pin ${pin.hit ? "event-falling-pin-hit" : ""}`}
      style={style}
      onClick={() => !pin.hit && onHit(pin.id)}
      onAnimationEnd={(event) => {
        if (event.target === event.currentTarget && !pin.hit) onFallEnd(pin.id);
      }}
      aria-label="Golpear pino de bowling"
    >
      <svg viewBox="0 0 100 210" aria-hidden="true">
        <path d="M50 8 C31 8 29 31 36 48 C40 57 35 68 26 83 C15 102 10 132 14 163 C18 190 31 203 50 203 C69 203 82 190 86 163 C90 132 85 102 74 83 C65 68 60 57 64 48 C71 31 69 8 50 8 Z" fill="#fffefd" stroke="#d7e1e6" strokeWidth="2" />
        <path d="M34 49 H66" stroke="#e11d48" strokeWidth="10" strokeLinecap="round" />
        <path d="M31 64 H69" stroke="#e11d48" strokeWidth="7" strokeLinecap="round" />
        <path d="M27 176 Q50 191 73 176" fill="none" stroke="#d7e1e6" strokeWidth="2" opacity="0.65" />
      </svg>
    </button>
  );
}
