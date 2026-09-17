import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import SEO from "../components/common/SEO";
import { juegoPreguntasData } from "../data/juegoPreguntasData";

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

export default function JuegoPreguntas() {
  const shuffledQuestions = useMemo(() => shuffle(juegoPreguntasData), []);
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [showPenalty, setShowPenalty] = useState(false);

  const currentQuestion = shuffledQuestions[currentIndex];

  const handleAnswer = (option) => {
    if (answered) return;

    setSelectedOption(option);
    setAnswered(true);

    if (option !== currentQuestion.correctAnswer) {
      setShowPenalty(true);
    }
  };

  const nextQuestion = () => {
    setSelectedOption(null);
    setAnswered(false);
    setShowPenalty(false);

    if (currentIndex < shuffledQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  return (
    <MainLayout>
      <SEO
        title="Juego de Preguntas | Bowling Club Gimnasia"
        description="Juego de preguntas de Bowling Club Gimnasia."
        keywords="preguntas, trivia, juego para beber, bowling club gimnasia"
        url="https://bowlingclubgimnasia.com/juegos/preguntas"
      />

      <section className="bg-black/35 px-4 py-20 text-white backdrop-blur-[2px]">
        <div className="mx-auto max-w-5xl">
          {!started ? (
            <div className="rounded-3xl border border-white/10 bg-zinc-900/70 p-8 backdrop-blur-sm md:p-12">
              <p className="mb-3 text-sm uppercase tracking-[0.3em] text-zinc-400">
                Juego 4
              </p>

              <h1 className="mb-6 text-4xl md:text-5xl">Juego de Preguntas</h1>

              <p className="mb-8 text-lg text-zinc-300">
                Respondé correctamente y seguí en juego. Si fallás, te toca beber.
                Ideal para medir reflejos, conocimiento y resistencia.
              </p>

              <div className="mb-8 rounded-2xl border border-white/10 bg-black/30 p-6">
                <h2 className="mb-4 text-2xl">Reglas</h2>
                <ul className="space-y-3 text-zinc-300">
                  <li>Leé la pregunta y elegí una de las opciones.</li>
                  <li>Si acertás, no debés beber.</li>
                  <li>Si fallás, aparece el cartel: “¡Bebé un trago!”.</li>
                  <li>Después avanzás con el botón “Siguiente pregunta”.</li>
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
              <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="mb-2 text-sm uppercase tracking-[0.3em] text-zinc-400">
                    Pregunta actual
                  </p>
                  <h2 className="text-3xl md:text-4xl">
                    {currentIndex + 1} / {shuffledQuestions.length}
                  </h2>
                </div>

                <Link
                  to="/juegos"
                  className="rounded-xl border border-white/15 px-5 py-3 font-semibold text-white transition hover:bg-white/5"
                >
                  Salir del juego
                </Link>
              </div>

              <div className="mb-8 rounded-2xl border border-white/10 bg-black/30 p-6">
                <h3 className="text-2xl md:text-3xl">{currentQuestion.question}</h3>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {currentQuestion.options.map((option) => {
                  const isCorrect = option === currentQuestion.correctAnswer;
                  const isSelected = selectedOption === option;

                  let className =
                    "rounded-2xl border border-white/10 bg-black/30 p-5 text-left text-zinc-100 transition";

                  if (answered) {
                    if (isCorrect) {
                      className += " border-green-400/40 bg-green-500/10";
                    } else if (isSelected) {
                      className += " border-red-400/40 bg-red-500/10";
                    }
                  } else {
                    className += " hover:bg-white/5";
                  }

                  return (
                    <button
                      key={option}
                      onClick={() => handleAnswer(option)}
                      disabled={answered}
                      className={className}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              {showPenalty && (
                <div className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-center">
                  <p className="text-2xl font-bold text-white">¡Bebé un trago!</p>
                </div>
              )}

              {answered && !showPenalty && (
                <div className="mt-8 rounded-2xl border border-green-500/20 bg-green-500/10 p-5 text-center">
                  <p className="text-2xl font-bold text-white">
                    ¡Correcto! No bebés nada.
                  </p>
                </div>
              )}

              {answered && (
                <div className="mt-8 flex flex-wrap gap-4">
                  <button
                    onClick={nextQuestion}
                    className="rounded-xl bg-white px-6 py-3 font-semibold text-black transition hover:scale-105"
                  >
                    Siguiente pregunta
                  </button>

                  <Link
                    to="/juegos"
                    className="rounded-xl border border-white/15 px-6 py-3 font-semibold text-white transition hover:bg-white/5"
                  >
                    Volver a Juegos
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
}