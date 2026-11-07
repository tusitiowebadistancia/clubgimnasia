export function appendQrPrintDocument(popup, venue, qr) {
  const document = popup.document;
  document.title = venue.label;
  const main = document.createElement("main");
  main.style.cssText = "font-family:Arial,sans-serif;text-align:center;padding:30px";
  const title = document.createElement("h1");
  title.textContent = venue.label;
  const code = document.createElement("p");
  code.textContent = `Código: ${venue.code}`;
  const image = document.createElement("img");
  image.src = qr.png;
  image.alt = `QR de ${venue.label}`;
  image.style.cssText = "width:420px;max-width:100%";
  const instruction = document.createElement("p");
  instruction.textContent = "Escaneá para abrir el menú";
  main.append(title, code, image, instruction);
  document.body.append(main);
  image.addEventListener("load", () => popup.print(), { once: true });
}

export function printQr(venue, qr) {
  const popup = window.open("", "_blank");
  if (!popup) throw new Error("El navegador bloqueó la ventana de impresión");
  popup.opener = null;
  appendQrPrintDocument(popup, venue, qr);
}
