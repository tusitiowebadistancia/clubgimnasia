import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getOperation } from "../../services/operation";

function applyTheme(theme) {
  document.documentElement.dataset.siteTheme = theme.toLowerCase();
  localStorage.setItem("bcg-effective-theme", theme.toLowerCase());
}

export default function SiteOperation() {
  const { pathname } = useLocation();
  const [operation, setOperation] = useState(null);

  useEffect(() => {
    if (pathname.startsWith("/admin")) {
      document.body.removeAttribute("data-public-site");
      return undefined;
    }

    document.body.dataset.publicSite = "true";
    let active = true;
    const refresh = () => getOperation().then((data) => {
      if (!active) return;
      setOperation(data);
      applyTheme(data.effectiveTheme);
    }).catch(() => {});
    refresh();
    const interval = window.setInterval(refresh, 60_000);
    return () => { active = false; window.clearInterval(interval); document.body.removeAttribute("data-public-site"); };
  }, [pathname]);

  if (pathname.startsWith("/admin") || !operation) return null;
  return <p role="status" aria-live="polite" className={`fixed bottom-5 left-5 z-40 rounded-full border px-3 py-2 text-xs font-bold tracking-wide shadow-lg backdrop-blur ${operation.isOpen ? "border-emerald-400/40 bg-emerald-950/80 text-emerald-200" : "border-slate-400/40 bg-slate-950/80 text-slate-100"}`}>{operation.isOpen ? "ABIERTO" : "CERRADO"}</p>;
}
