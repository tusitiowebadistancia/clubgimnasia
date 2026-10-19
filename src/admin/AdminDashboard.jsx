import { useEffect, useState } from "react";
import { AlertTriangle, Boxes, CircleDollarSign, Layers3, RefreshCw, Tag } from "lucide-react";
import { adminRequest } from "./api";

const cards = [{ key: "products", label: "Productos oficiales", icon: Boxes }, { key: "categories", label: "Categorías", icon: Layers3 }, { key: "withoutCategory", label: "Sin categoría", icon: Tag }, { key: "zeroPrice", label: "Precio cero", icon: CircleDollarSign }];

export default function AdminDashboard() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");
  const [syncing, setSyncing] = useState(false);
  const load = () => adminRequest("/admin/summary").then(setSummary).catch((requestError) => setError(requestError.message));
  useEffect(() => { load(); }, []);
  async function sync() {
    if (!window.confirm("¿Sincronizar el catálogo oficial desde NegoPlus ahora?")) return;
    setSyncing(true); setError("");
    try { await adminRequest("/admin/sync", { method: "POST" }); await load(); } catch (requestError) { setError(requestError.message); } finally { setSyncing(false); }
  }
  return <section><div className="flex flex-wrap items-end justify-between gap-5"><div><p className="text-sm text-cyan-300">OPERACIÓN DEL LOCAL</p><h1 className="mt-1 text-3xl font-semibold">Resumen del catálogo</h1><p className="mt-2 text-sm text-slate-400">Datos oficiales sincronizados desde NegoPlus.</p></div><button onClick={sync} disabled={syncing} className="flex items-center gap-2 rounded-xl bg-cyan-300 px-4 py-3 text-sm font-semibold text-slate-950 disabled:opacity-60"><RefreshCw size={17} className={syncing ? "animate-spin" : ""} />{syncing ? "Sincronizando…" : "Sincronizar ahora"}</button></div>{error && <p className="mt-6 rounded-xl border border-rose-400/30 bg-rose-400/10 p-4 text-sm text-rose-200" role="alert">{error}</p>}{!summary ? <p className="mt-10 text-slate-400">Cargando indicadores…</p> : <><div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(({ key, label, icon: Icon }) => <article key={key} className="rounded-2xl border border-white/10 bg-[#101720] p-5"><Icon size={19} className="text-cyan-300" /><p className="mt-7 text-3xl font-semibold">{summary[key]}</p><p className="mt-1 text-sm text-slate-400">{label}</p></article>)}</div><div className="mt-6 grid gap-5 lg:grid-cols-2"><article className="rounded-2xl border border-white/10 bg-[#101720] p-6"><h2 className="font-semibold">Última sincronización</h2><p className="mt-4 text-2xl font-semibold text-cyan-200">{summary.latestSync?.status ?? "Sin registros"}</p>{summary.latestSync && <p className="mt-2 text-sm text-slate-400">{summary.latestSync.categoryCount} categorías · {summary.latestSync.productCount} productos</p>}</article><article className="rounded-2xl border border-amber-300/15 bg-amber-300/5 p-6"><div className="flex items-center gap-2 text-amber-200"><AlertTriangle size={18} /><h2 className="font-semibold">Atención comercial</h2></div><p className="mt-4 text-sm leading-6 text-slate-300">Los productos con precio cero se muestran para control, pero no deben habilitarse como compra hasta contar con una regla comercial autorizada.</p></article></div></>}</section>;
}
