import { motion } from "framer-motion";

export default function PoolTournaments() {
  return (
    <section className="bg-black/35 px-4 py-24 text-white backdrop-blur-[2px] overflow-hidden">
      <div className="mx-auto max-w-7xl text-center">
        <div className="mb-10">
          <h2 className="mb-4 text-3xl md:text-4xl">
            Seguí el ambiente del club también en Instagram
          </h2>
          <p className="mx-auto max-w-2xl text-zinc-400 md:text-lg">
            Descubrí fotos, momentos, energía y todo lo que se vive dentro del club.
            Seguinos para ver más del espacio, la onda del lugar y próximas novedades.
          </p>
        </div>

        <div className="relative mx-auto h-[180px] w-full max-w-5xl overflow-hidden">
          <motion.div
            className="absolute left-[4%] top-1/2 z-30"
            initial={{ x: 0, y: "-50%", rotate: 0, opacity: 0 }}
            animate={{
              x: ["0vw", "62vw"],
              y: ["-50%", "-50%"],
              rotate: [0, 540],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatDelay: 0,
              ease: "linear",
              times: [0, 0.12, 0.88, 1],
            }}
          >
            <div className="relative h-12 w-12 md:h-14 md:w-14">
              <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,#4a4a4a_0%,#111_30%,#000_70%,#000_100%)] shadow-[0_0_16px_rgba(255,255,255,0.08)]" />
              <div className="absolute left-[20%] top-[18%] h-2.5 w-2.5 rounded-full bg-white/20 blur-[1px] md:h-3 md:w-3" />
              <div className="absolute left-1/2 top-1/2 flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[10px] font-black text-black md:h-6 md:w-6 md:text-xs">
                8
              </div>
            </div>
          </motion.div>
        </div>

        <a
          href="https://instagram.com/bowlingimnasia"
          target="_blank"
          rel="noreferrer"
          className="instagram-btn mt-8 inline-flex items-center justify-center rounded-xl px-6 py-3 font-semibold text-white shadow-lg transition hover:scale-105"
        >
          Seguinos en Instagram
        </a>
      </div>
    </section>
  );
}