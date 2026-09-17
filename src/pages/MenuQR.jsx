import { useMemo, useState } from "react";
import { buildMenuUrlForTable, TABLE_OPTIONS } from "../data/menuData";

export default function MenuQR() {
  const [selectedTable, setSelectedTable] = useState("1");
  const [appliedTable, setAppliedTable] = useState("1");

  const qrValue = useMemo(() => {
    return buildMenuUrlForTable(appliedTable);
  }, [appliedTable]);

  const qrImageUrl = useMemo(() => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&margin=40&data=${encodeURIComponent(
      qrValue
    )}`;
  }, [qrValue]);

  const handleApply = () => {
    setAppliedTable(selectedTable);
  };

  const handleDownload = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const qrImg = new Image();

    canvas.width = 1200;
    canvas.height = 1600;

    qrImg.crossOrigin = "anonymous";

    qrImg.onload = () => {
      if (!ctx) return;

      ctx.fillStyle = "#041019";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const bgGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      bgGradient.addColorStop(0, "rgba(34,211,238,0.12)");
      bgGradient.addColorStop(0.5, "rgba(8,47,73,0.10)");
      bgGradient.addColorStop(1, "rgba(168,85,247,0.10)");
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawRoundedRect(ctx, 95, 120, 1010, 1320, 46, "#ffffff");

      ctx.fillStyle = "#07131c";
      ctx.font = "bold 68px Arial";
      ctx.textAlign = "center";
      ctx.fillText("CLUB GIMNASIA", canvas.width / 2, 225);

      ctx.fillStyle = "#0891b2";
      ctx.font = "bold 34px Arial";
      ctx.fillText("MENU DIGITAL", canvas.width / 2, 285);

      ctx.fillStyle = "#0f172a";
      ctx.font = "bold 52px Arial";
      ctx.fillText(`MESA ${appliedTable}`, canvas.width / 2, 355);

      drawRoundedRect(ctx, 210, 390, 780, 780, 34, "#f8fafc");
      ctx.drawImage(qrImg, 260, 440, 680, 680);

      ctx.fillStyle = "#0f172a";
      ctx.font = "bold 34px Arial";
      ctx.fillText("Escaneá y hacé tu pedido", canvas.width / 2, 1230);

      ctx.fillStyle = "#475569";
      ctx.font = "28px Arial";
      ctx.fillText(
        "Este QR abre el menú y deja configurada automáticamente la mesa.",
        canvas.width / 2,
        1288
      );

      ctx.fillText(
        "El pedido se enviará por WhatsApp con el número de mesa correcto.",
        canvas.width / 2,
        1334
      );

      const link = document.createElement("a");
      link.download = `club-gimnasia-mesa-${appliedTable}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };

    qrImg.src = qrImageUrl;
  };

  return (
    <section className="relative overflow-hidden rounded-[32px] border border-cyan-400/15 bg-gradient-to-br from-[#06131b] via-[#071a24] to-[#0a1020] p-5 shadow-[0_30px_90px_rgba(0,0,0,0.35)] md:p-7">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.14),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.14),transparent_34%)]" />

      <div className="relative z-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <span className="inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-300">
            QR PREMIUM
          </span>

          <h2 className="mt-4 text-3xl font-black uppercase tracking-[0.06em] text-white md:text-4xl">
            Generador de QR por mesa
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70 md:text-base">
            Elegí la mesa, actualizá el QR y descargalo. Todos los códigos llevan
            al mismo menú, pero cada uno guarda la mesa para que la bienvenida y el
            pedido por WhatsApp salgan correctamente.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end">
            <label className="min-w-[220px] flex-1">
              <span className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-cyan-200/85">
                Número de mesa
              </span>

              <select
                value={selectedTable}
                onChange={(e) => setSelectedTable(e.target.value)}
                className="h-14 w-full rounded-2xl border border-white/10 bg-white/10 px-4 text-sm font-semibold text-white outline-none transition focus:border-cyan-400/35 focus:bg-white/15"
              >
                {TABLE_OPTIONS.map((table) => (
                  <option key={table.value} value={table.value} className="text-black">
                    {table.label}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="button"
              onClick={handleApply}
              className="inline-flex h-14 items-center justify-center rounded-2xl border border-cyan-400/25 bg-cyan-400/15 px-5 text-sm font-bold uppercase tracking-[0.12em] text-cyan-200 transition hover:scale-[1.01] hover:bg-cyan-400/25"
            >
              Actualizar QR
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex h-14 items-center justify-center rounded-2xl border border-fuchsia-400/20 bg-fuchsia-400/15 px-5 text-sm font-bold uppercase tracking-[0.12em] text-fuchsia-100 transition hover:scale-[1.01] hover:bg-fuchsia-400/25"
            >
              Descargar
            </button>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[370px] rounded-[34px] border border-white/10 bg-white/[0.96] p-6 shadow-[0_25px_100px_rgba(0,0,0,0.45)]">
          <div className="text-center">
            <p className="text-[11px] font-black uppercase tracking-[0.32em] text-slate-500">
              Club Gimnasia
            </p>

            <h3 className="mt-2 text-3xl font-black uppercase tracking-[0.08em] text-slate-900">
              Mesa {appliedTable}
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Escaneá para entrar al menú digital.
            </p>
          </div>

          <div className="mt-6 flex justify-center rounded-[28px] bg-white p-4 shadow-[inset_0_0_0_1px_rgba(15,23,42,0.06)]">
            <img
              src={qrImageUrl}
              alt={`QR mesa ${appliedTable}`}
              className="h-[260px] w-[260px] rounded-xl object-contain"
              style={{ imageRendering: "pixelated" }}
            />
          </div>

          <div className="mt-5 rounded-2xl bg-slate-100 px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.1em] text-slate-600">
            Este QR abre el menú y deja preparada la mesa {appliedTable}
          </div>
        </div>
      </div>
    </section>
  );
}

function drawRoundedRect(ctx, x, y, width, height, radius, fillColor) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();

  ctx.fillStyle = fillColor;
  ctx.fill();
}