export default function WhatsAppButton() {
  const phone = "542262589377";
  const text = encodeURIComponent("Hola, quiero consultar por Bowling Club Gimnasia");

  return (
    <a
      href={`https://wa.me/${phone}?text=${text}`}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-50 rounded-full bg-green-500 px-5 py-3 font-semibold text-white shadow-lg transition hover:scale-105"
    >
      WhatsApp
    </a>
  );
}