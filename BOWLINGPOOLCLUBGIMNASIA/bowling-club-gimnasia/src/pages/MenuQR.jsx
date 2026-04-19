import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

export default function MenuQR() {
  const menuUrl = "http://localhost:5173/menu";
  const canvasRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const logo = new Image();
    logo.src = "/images/LogoClub.png";

    logo.onload = async () => {
      const width = 1100;
      const height = 1500;

      canvas.width = width;
      canvas.height = height;

      // fondo general
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);

      // tarjeta central
      const cardX = 90;
      const cardY = 90;
      const cardW = width - 180;
      const cardH = height - 180;
      const radius = 42;

      drawRoundedRect(ctx, cardX, cardY, cardW, cardH, radius);
      ctx.fillStyle = "#111111";
      ctx.fill();

      // borde tarjeta
      drawRoundedRect(ctx, cardX, cardY, cardW, cardH, radius);
      ctx.strokeStyle = "rgba(255,255,255,0.12)";
      ctx.lineWidth = 3;
      ctx.stroke();

      // glow sutil
      ctx.save();
      ctx.shadowColor = "rgba(77,181,255,0.20)";
      ctx.shadowBlur = 40;
      drawRoundedRect(ctx, cardX, cardY, cardW, cardH, radius);
      ctx.strokeStyle = "rgba(77,181,255,0.10)";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      // logo arriba
      const logoTopSize = 110;
      const logoTopX = width / 2 - logoTopSize / 2;
      const logoTopY = 140;

      drawRoundedRect(ctx, logoTopX, logoTopY, logoTopSize, logoTopSize, 26);
      ctx.save();
      ctx.clip();
      ctx.drawImage(logo, logoTopX, logoTopY, logoTopSize, logoTopSize);
      ctx.restore();

      // título Club Gimnasia
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      ctx.font = "86px Brush Script MT, Segoe Script, cursive";
      ctx.fillStyle = "#f8f5f2";
      ctx.shadowColor = "rgba(255,255,255,0.55)";
      ctx.shadowBlur = 18;
      ctx.fillText("Club", width / 2 - 120, 320);

      ctx.fillStyle = "#4db5ff";
      ctx.shadowColor = "rgba(77,181,255,0.75)";
      ctx.shadowBlur = 24;
      ctx.fillText("Gimnasia", width / 2 + 95, 320);

      // subtítulo
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#bcbcbc";
      ctx.font = "30px Arial";
      ctx.fillText("QR privado para acceder al menú del club", width / 2, 400);

      // QR base en canvas auxiliar
      const qrCanvas = document.createElement("canvas");
      await QRCode.toCanvas(qrCanvas, menuUrl, {
        width: 620,
        margin: 2,
        errorCorrectionLevel: "H",
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      });

      // caja blanca del QR
      const qrSize = 620;
      const qrX = width / 2 - qrSize / 2;
      const qrY = 500;

      drawRoundedRect(ctx, qrX - 18, qrY - 18, qrSize + 36, qrSize + 36, 26);
      ctx.fillStyle = "#ffffff";
      ctx.fill();

      ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);

      // bloque blanco central para logo dentro del QR
      const centerBox = 150;
      const centerX = width / 2 - centerBox / 2;
      const centerY = qrY + qrSize / 2 - centerBox / 2;

      drawRoundedRect(ctx, centerX, centerY, centerBox, centerBox, 26);
      ctx.fillStyle = "#ffffff";
      ctx.fill();

      drawRoundedRect(ctx, centerX, centerY, centerBox, centerBox, 26);
      ctx.strokeStyle = "rgba(0,0,0,0.10)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // logo central
      const innerLogoSize = 108;
      const innerLogoX = width / 2 - innerLogoSize / 2;
      const innerLogoY = qrY + qrSize / 2 - innerLogoSize / 2;

      drawRoundedRect(ctx, innerLogoX, innerLogoY, innerLogoSize, innerLogoSize, 22);
      ctx.save();
      ctx.clip();
      ctx.drawImage(logo, innerLogoX, innerLogoY, innerLogoSize, innerLogoSize);
      ctx.restore();

      // texto inferior
      ctx.fillStyle = "#d4d4d8";
      ctx.font = "28px Arial";
      ctx.fillText("Escaneá para ver el menú", width / 2, 1180);

      ctx.fillStyle = "#8c8c8c";
      ctx.font = "24px Arial";
      ctx.fillText("Bowling Club Gimnasia", width / 2, 1230);

      setIsReady(true);
    };
  }, [menuUrl]);

  const downloadQr = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "qr-menu-club-gimnasia-pro.png";
    link.click();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "820px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            background: "#0f0f0f",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "28px",
            padding: "24px",
            boxShadow: "0 0 32px rgba(255,255,255,0.04)",
          }}
        >
          <canvas
            ref={canvasRef}
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "22px",
              display: "block",
              background: "#000",
            }}
          />
        </div>

        <button
          onClick={downloadQr}
          disabled={!isReady}
          style={{
            marginTop: "22px",
            background: "#ffffff",
            color: "#000000",
            border: "none",
            borderRadius: "14px",
            padding: "14px 24px",
            fontWeight: 700,
            fontSize: "16px",
            cursor: isReady ? "pointer" : "not-allowed",
            opacity: isReady ? 1 : 0.6,
          }}
        >
          Descargar QR PRO
        </button>
      </div>
    </div>
  );
}

function drawRoundedRect(ctx, x, y, width, height, radius) {
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
}