import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function EventosIncludes() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.35 });

  return (
    <section
      ref={ref}
      className="bg-black/35 px-4 py-20 text-white backdrop-blur-[2px]"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-zinc-400">
            Reserva rápida
          </p>
          <h2 className="mb-4 text-3xl md:text-4xl">
            Tu próximo evento puede empezar hoy mismo
          </h2>
          <p className="mx-auto max-w-3xl text-zinc-400">
            Consultá por WhatsApp, resolvé disponibilidad en minutos y empezá a
            organizar un cumpleaños, festejo o reunión con una propuesta distinta,
            simple y mucho más divertida.
          </p>
        </div>

        <div className="relative mx-auto mt-12 flex h-[220px] w-full max-w-5xl items-center overflow-hidden">
          <motion.div
            className="absolute left-0 z-10"
            initial={{ x: -120, opacity: 0 }}
            animate={
              isInView
                ? {
                    x: "calc(100vw - 420px)",
                    rotate: 720,
                    opacity: [0, 1, 1, 0],
                  }
                : {}
            }
            transition={{
              duration: 2.8,
              ease: "easeInOut",
              times: [0, 0.12, 0.85, 1],
            }}
          >
            <div className="relative h-24 w-24 md:h-28 md:w-28">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-500 via-red-600 to-red-800 shadow-[0_0_35px_rgba(239,68,68,0.22)]" />
              <div className="absolute left-[18%] top-[14%] h-5 w-5 rounded-full bg-white/30 blur-sm md:h-6 md:w-6" />
              <div className="absolute left-[34%] top-[28%] h-3.5 w-3.5 rounded-full bg-black/60 md:h-4 md:w-4" />
              <div className="absolute right-[28%] top-[38%] h-3.5 w-3.5 rounded-full bg-black/60 md:h-4 md:w-4" />
              <div className="absolute left-[42%] bottom-[24%] h-4 w-4 rounded-full bg-black/70 md:h-5 md:w-5" />
            </div>
          </motion.div>

          <motion.a
            href="https://wa.me/542262589377?text=Hola%2C%20quiero%20consultar%20por%20eventos%20o%20cumplea%C3%B1os%20en%20Bowling%20Club%20Gimnasia."
            target="_blank"
            rel="noreferrer"
            className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-green-500 px-6 py-3 font-semibold text-white shadow-lg transition hover:scale-105"
            initial={{ opacity: 0, y: 18 }}
            animate={
              isInView
                ? {
                    opacity: 1,
                    y: 0,
                  }
                : {}
            }
            transition={{
              duration: 0.8,
              delay: 2.55,
              ease: "easeOut",
            }}
          >
            Reservar por WhatsApp
          </motion.a>
        </div>
      </div>
    </section>
  );
}