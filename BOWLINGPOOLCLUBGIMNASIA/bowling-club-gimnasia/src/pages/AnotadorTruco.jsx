import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import SEO from "../components/common/SEO";

function splitScore(score) {
  return {
    top: Math.min(score, 15),
    bottom: Math.max(score - 15, 0),
  };
}

function buildGroups(count) {
  const groups = [];
  const fullGroups = Math.floor(count / 5);
  const remainder = count % 5;

  for (let i = 0; i < fullGroups; i++) groups.push(5);
  if (remainder > 0) groups.push(remainder);

  return groups;
}

function MatchStick({ className = "" }) {
  return <div className={`truco-stick ${className}`} />;
}

function TallyGroup({ count }) {
  return (
    <div className="truco-group">
      {count >= 1 && <MatchStick className="truco-stick-v left" />}
      {count >= 2 && <MatchStick className="truco-stick-h top" />}
      {count >= 3 && <MatchStick className="truco-stick-v right" />}
      {count >= 4 && <MatchStick className="truco-stick-h bottom" />}
      {count === 5 && <MatchStick className="truco-stick-d slash" />}
    </div>
  );
}

function ScoreZone({ count }) {
  const groups = useMemo(() => buildGroups(count), [count]);

  return (
    <div className="flex flex-wrap gap-4">
      {groups.map((group, index) => (
        <TallyGroup key={`${group}-${index}`} count={group} />
      ))}
    </div>
  );
}

function TeamPanel({ title, score, onAdd, isWinner }) {
  const { top, bottom } = splitScore(score);

  return (
    <button
      type="button"
      onClick={onAdd}
      className={`w-full rounded-[1.75rem] border p-6 text-left transition ${
        isWinner
          ? "border-green-400/30 bg-green-500/10"
          : "border-white/10 bg-zinc-900/70 hover:bg-white/5"
      }`}
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="mb-2 text-sm uppercase tracking-[0.28em] text-zinc-400">
            Equipo
          </p>
          <h2 className="text-3xl md:text-4xl">{title}</h2>
        </div>

        <div className="text-right">
          <p className="text-sm uppercase tracking-[0.22em] text-zinc-500">Puntos</p>
          <p className="text-3xl font-bold text-white md:text-4xl">{score}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black/25 p-5">
        <ScoreZone count={top} />

        {score > 15 && (
          <>
            <div className="my-5 h-px w-full bg-white/15" />
            <ScoreZone count={bottom} />
          </>
        )}
      </div>
    </button>
  );
}

export default function AnotadorTruco() {
  const [started, setStarted] = useState(false);
  const [nosotros, setNosotros] = useState(0);
  const [ellos, setEllos] = useState(0);
  const [history, setHistory] = useState([]);

  const addPoint = (team) => {
    if (!started) return;
    if (nosotros >= 30 || ellos >= 30) return;

    if (team === "nosotros" && nosotros < 30) {
      setHistory((prev) => [...prev, { team: "nosotros" }]);
      setNosotros((prev) => Math.min(prev + 1, 30));
    }

    if (team === "ellos" && ellos < 30) {
      setHistory((prev) => [...prev, { team: "ellos" }]);
      setEllos((prev) => Math.min(prev + 1, 30));
    }
  };

  const undoLast = () => {
    if (history.length === 0) return;

    const last = history[history.length - 1];

    if (last.team === "nosotros") {
      setNosotros((prev) => Math.max(prev - 1, 0));
    } else {
      setEllos((prev) => Math.max(prev - 1, 0));
    }

    setHistory((prev) => prev.slice(0, -1));
  };

  const resetGame = () => {
    setNosotros(0);
    setEllos(0);
    setHistory([]);
  };

  const finished = nosotros >= 30 || ellos >= 30;
  const winner =
    nosotros >= 30 ? "Nosotros" : ellos >= 30 ? "Ellos" : null;

  return (
    <MainLayout>
      <SEO
        title="Anotador de Truco | Bowling Club Gimnasia"
        description="Anotador de truco digital de Bowling Club Gimnasia."
        keywords="truco, anotador, truco digital, bowling club gimnasia"
        url="https://tudominio.com/juegos/anotador-truco"
      />

      <section className="bg-black/35 px-4 py-20 text-white backdrop-blur-[2px]">
        <div className="mx-auto max-w-6xl">
          {!started ? (
            <div className="rounded-3xl border border-white/10 bg-zinc-900/70 p-8 backdrop-blur-sm md:p-12">
              <p className="mb-3 text-sm uppercase tracking-[0.3em] text-zinc-400">
                Juego 5
              </p>

              <h1 className="mb-6 text-4xl md:text-5xl">Anotador de Truco</h1>

              <p className="mb-8 text-lg text-zinc-300">
                Llevá el tanteador de una partida de truco con un estilo visual
                clásico, claro y rápido de usar.
              </p>

              <div className="mb-8 rounded-2xl border border-white/10 bg-black/30 p-6">
                <h2 className="mb-4 text-2xl">Reglas</h2>
                <ul className="space-y-3 text-zinc-300">
                  <li>Hacé clic en “Nosotros” o “Ellos” para sumar un palito.</li>
                  <li>Los puntos se agrupan de a 5 como un tanteador clásico.</li>
                  <li>Al superar 15, el tanteo sigue debajo de una línea.</li>
                  <li>La partida termina al llegar a 30.</li>
                  <li>Podés usar “Deshacer” para corregir una jugada.</li>
                </ul>
              </div>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => setStarted(true)}
                  className="rounded-xl bg-white px-6 py-3 font-semibold text-black transition hover:scale-105"
                >
                  Jugar
                </button>

                <Link
                  to="/juegos"
                  className="rounded-xl border border-white/15 px-6 py-3 font-semibold text-white transition hover:bg-white/5"
                >
                  Volver a Juegos
                </Link>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-white/10 bg-zinc-900/70 p-8 backdrop-blur-sm md:p-12">
              <div className="mb-10 text-center">
                <div className="menu-title-logo">
                  <span className="menu-title-club">Club</span>{" "}
                  <span className="menu-title-gimnasia">Gimnasia</span>
                </div>
              </div>

              <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="mb-2 text-sm uppercase tracking-[0.3em] text-zinc-400">
                    Anotador activo
                  </p>
                  <h2 className="text-3xl md:text-4xl">Nosotros | Ellos</h2>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={undoLast}
                    className="rounded-xl border border-white/15 px-5 py-3 font-semibold text-white transition hover:bg-white/5"
                  >
                    Deshacer
                  </button>

                  <button
                    onClick={resetGame}
                    className="rounded-xl border border-white/15 px-5 py-3 font-semibold text-white transition hover:bg-white/5"
                  >
                    Reiniciar
                  </button>

                  <Link
                    to="/juegos"
                    className="rounded-xl border border-white/15 px-5 py-3 font-semibold text-white transition hover:bg-white/5"
                  >
                    Salir
                  </Link>
                </div>
              </div>

              {finished && (
                <div className="mb-8 rounded-2xl border border-green-500/20 bg-green-500/10 p-5 text-center">
                  <p className="text-2xl font-bold text-white">
                    ¡Ganó {winner}!
                  </p>
                </div>
              )}

              <div className="grid gap-8 md:grid-cols-2">
                <TeamPanel
                  title="Nosotros"
                  score={nosotros}
                  onAdd={() => addPoint("nosotros")}
                  isWinner={nosotros >= 30}
                />

                <TeamPanel
                  title="Ellos"
                  score={ellos}
                  onAdd={() => addPoint("ellos")}
                  isWinner={ellos >= 30}
                />
              </div>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
}