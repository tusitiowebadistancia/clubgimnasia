import useMousePosition from "../../hooks/useMousePosition";

export default function InteractiveBackground() {
  const { x, y } = useMousePosition();

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Base oscura */}
      <div className="absolute inset-0 bg-[#0a0a0a]" />

      {/* Glow principal interactivo */}
      <div
        className="absolute h-[500px] w-[500px] rounded-full bg-white/5 blur-3xl transition-transform duration-300 ease-out"
        style={{
          left: `${x}%`,
          top: `${y}%`,
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Mancha roja suave */}
      <div className="absolute left-[10%] top-[20%] h-[320px] w-[320px] rounded-full bg-red-500/5 blur-3xl" />

      {/* Mancha azul suave */}
      <div className="absolute right-[10%] top-[60%] h-[320px] w-[320px] rounded-full bg-blue-500/5 blur-3xl" />

      {/* Glow secundario fijo */}
      <div className="absolute bottom-[10%] left-[35%] h-[260px] w-[260px] rounded-full bg-white/4 blur-3xl" />

      {/* Viñeta sutil */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.5)_100%)]" />
    </div>
  );
}