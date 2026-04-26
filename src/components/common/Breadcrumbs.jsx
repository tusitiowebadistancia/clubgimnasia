import { Link, useLocation } from "react-router-dom";

export default function Breadcrumbs() {
  const location = useLocation();

  const pathnames = location.pathname.split("/").filter(Boolean);

  const formatLabel = (segment) => {
    return segment
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <div className="border-b border-white/10 bg-black/80 px-4 py-3 text-sm text-zinc-300">
      <div className="mx-auto max-w-7xl">
        <Link to="/" className="transition hover:text-white">
          Inicio
        </Link>

        {pathnames.map((segment, index) => {
          const to = "/" + pathnames.slice(0, index + 1).join("/");
          const isLast = index === pathnames.length - 1;

          return (
            <span key={to}>
              {" > "}
              {isLast ? (
                <span className="text-white">{formatLabel(segment)}</span>
              ) : (
                <Link to={to} className="transition hover:text-white">
                  {formatLabel(segment)}
                </Link>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}