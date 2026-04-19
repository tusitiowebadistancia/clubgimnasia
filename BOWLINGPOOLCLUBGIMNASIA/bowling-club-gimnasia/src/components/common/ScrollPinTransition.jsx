import { motion, useInView } from "framer-motion";
import { useMemo, useRef } from "react";

export default function ScrollPinTransition() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.35 });

  const pins = useMemo(() => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

    return isMobile
      ? [
          { id: 1, offset: -150, delay: 0 },
          { id: 2, offset: -110, delay: 0.06 },
          { id: 3, offset: -70, delay: 0.12 },
          { id: 4, offset: -30, delay: 0.18 },
          { id: 5, offset: 10, delay: 0.24 },
          { id: 6, offset: 50, delay: 0.30 },
          { id: 7, offset: 90, delay: 0.36 },
          { id: 8, offset: 130, delay: 0.42 },
        ]
      : [
          { id: 1, offset: -450, delay: 0 },
          { id: 2, offset: -350, delay: 0.08 },
          { id: 3, offset: -250, delay: 0.16 },
          { id: 4, offset: -150, delay: 0.24 },
          { id: 5, offset: -50, delay: 0.32 },
          { id: 6, offset: 50, delay: 0.40 },
          { id: 7, offset: 150, delay: 0.48 },
          { id: 8, offset: 250, delay: 0.56 },
          { id: 9, offset: 350, delay: 0.64 },
          { id: 10, offset: 450, delay: 0.72 },
        ];
  }, []);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[65vh] items-center justify-center overflow-hidden px-4 py-24"
    >
      <div className="relative mx-auto h-[360px] w-full max-w-6xl">
        {pins.map((pin) => (
          <motion.div
            key={pin.id}
            className="absolute bottom-0 flex flex-col items-center"
            style={{ left: `calc(50% + ${pin.offset}px)` }}
            initial={{ y: 180, opacity: 0 }}
            animate={
              isInView
                ? {
                    y: -260,
                    opacity: 1,
                  }
                : {}
            }
            transition={{
              duration: 1.1,
              delay: pin.delay,
              ease: "easeInOut",
            }}
          >
            <motion.div
              className="w-[2px] bg-white/80"
              initial={{ height: 0, opacity: 0 }}
              animate={
                isInView
                  ? {
                      height: 90,
                      opacity: 1,
                    }
                  : {}
              }
              transition={{
                duration: 0.8,
                delay: pin.delay,
                ease: "easeOut",
              }}
            />

            <img
              src="/images/bowling-pin.png"
              alt={`Pino ${pin.id}`}
              className="h-24 w-auto object-contain md:h-44"
            />
          </motion.div>
        ))}

        <motion.div
          className="absolute left-1/2 top-[65%] z-10 w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 px-4 text-center"
          initial={{ opacity: 0, y: 24 }}
          animate={
            isInView
              ? {
                  opacity: 1,
                  y: 0,
                }
              : {}
          }
          transition={{
            duration: 0.9,
            delay: 1.05,
            ease: "easeOut",
          }}
        >
          <h2 className="text-3xl md:text-5xl">
            Los esperamos
          </h2>
        </motion.div>
      </div>
    </section>
  );
}