export function buildWhatsAppUrl(message) {
  const phone = "542262589377";
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}