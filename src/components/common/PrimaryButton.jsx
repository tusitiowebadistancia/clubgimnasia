export default function PrimaryButton({
  href,
  children,
  target = "_self",
  rel,
  className = "",
}) {
  return (
    <a
      href={href}
      target={target}
      rel={rel}
      className={`inline-block rounded-xl bg-white px-6 py-3 text-center font-semibold text-black transition hover:scale-105 ${className}`}
    >
      {children}
    </a>
  );
}