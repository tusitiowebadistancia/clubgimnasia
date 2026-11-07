import { useEffect, useState } from "react";
import { Check, RefreshCw, Save } from "lucide-react";
import { adminRequest } from "./api";

const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const defaults = days.map((_, dayOfWeek) => ({ dayOfWeek, opensAt: "19:30", closesAt: "04:30", closed: false }));

export default function AdminConfiguration() {
  const [hours, setHours] = useState(defaults);
  const [themeMode, setThemeMode] = useState("AUTOMATIC");
  const [operation, setOperation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  async function load() {
    setLoading(true); setError("");
    try {
      const [savedHours, config, current] = await Promise.all([adminRequest("/admin/hours"), adminRequest("/admin/config"), adminRequest("/public/operation")]);
      setHours(savedHours.length === 7 ? savedHours : defaults);
      setThemeMode(config?.themeMode ?? "AUTOMATIC");
      setOperation(current);
    } catch (reason) { setError(reason.message); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);
  function changeHour(dayOfWeek, field, value) { setHours((current) => current.map((hour) => hour.dayOfWeek === dayOfWeek ? { ...hour, [field]: value } : hour)); }
  async function save() {
    setSaving(true); setError("");
    try {
      await Promise.all([adminRequest("/admin/hours", { method: "PUT", body: hours.map(({ dayOfWeek, opensAt, closesAt, closed }) => ({ dayOfWeek, opensAt: closed ? null : opensAt, closesAt: closed ? null : closesAt, closed })) }), adminRequest("/admin/config", { method: "PUT", body: { themeMode } })]);
      setNotice("Horarios y tema guardados.");
      await load();
    } catch (reason) { setError(reason.message); }
    finally { setSaving(false); }
  }
  return <section><div><p className="text-sm text-cyan-300">OPERACIÓN DEL LOCAL</p><h1 className="mt-1 text-3xl font-semibold">Horarios y apariencia</h1><p className="mt-2 text-sm text-slate-400">Los horarios se interpretan siempre en America/Argentina/Buenos_Aires.</p></div>{error && <div role="alert" className="mt-5 rounded-xl bg-rose-400/10 p-4 text-sm text-rose-200">{error}<button onClick={load} className="ml-3 underline">Reintentar</button></div>}{notice && <p className="mt-5 flex gap-2 rounded-xl bg-emerald-400/10 p-4 text-sm text-emerald-200"><Check size={16} />{notice}</p>}{loading ? <div className="mt-10 flex gap-3 text-slate-400"><RefreshCw className="animate-spin" size={18} />Cargando configuración...</div> : <><article className="mt-7 rounded-2xl border border-white/10 bg-[#101720] p-5"><p className="text-sm text-slate-400">Estado actual</p><p className={`mt-2 text-2xl font-semibold ${operation?.isOpen ? "text-emerald-300" : "text-slate-200"}`}>{operation?.isOpen ? "ABIERTO" : "CERRADO"}</p><p className="mt-1 text-xs text-slate-500">Zona horaria: {operation?.timeZone}</p></article><div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-[#101720]"><div className="grid grid-cols-[1fr_auto_auto_auto] gap-3 border-b border-white/10 px-4 py-3 text-xs uppercase tracking-wide text-slate-500"><span>Día</span><span>Abre</span><span>Cierra</span><span>Cerrado</span></div>{hours.map((hour) => <div key={hour.dayOfWeek} className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-3 border-b border-white/5 px-4 py-3 last:border-0"><span className="text-sm">{days[hour.dayOfWeek]}</span><input aria-label={`Apertura ${days[hour.dayOfWeek]}`} disabled={hour.closed} type="time" value={hour.opensAt ?? ""} onChange={(event) => changeHour(hour.dayOfWeek, "opensAt", event.target.value)} className="w-24 rounded-lg border border-white/10 bg-black/20 p-2 text-sm disabled:opacity-40" /><input aria-label={`Cierre ${days[hour.dayOfWeek]}`} disabled={hour.closed} type="time" value={hour.closesAt ?? ""} onChange={(event) => changeHour(hour.dayOfWeek, "closesAt", event.target.value)} className="w-24 rounded-lg border border-white/10 bg-black/20 p-2 text-sm disabled:opacity-40" /><input aria-label={`Cerrar ${days[hour.dayOfWeek]}`} type="checkbox" checked={hour.closed} onChange={(event) => changeHour(hour.dayOfWeek, "closed", event.target.checked)} /></div>)}</div><section className="mt-7"><h2 className="text-xl font-semibold">Tema público</h2><div className="mt-4 grid gap-4 md:grid-cols-3">{[["AUTOMATIC", "Automático", "Abierto: oscuro. Cerrado: claro."], ["DARK", "Oscuro", "Identidad nocturna permanente."], ["LIGHT", "Claro", "Vista clara permanente."]].map(([value, label, detail]) => <label key={value} className={`cursor-pointer rounded-2xl border p-5 ${themeMode === value ? "border-cyan-300 bg-cyan-300/10" : "border-white/10 bg-[#101720]"}`}><input className="sr-only" type="radio" value={value} checked={themeMode === value} onChange={(event) => setThemeMode(event.target.value)} /><span className="font-semibold">{label}</span><span className="mt-2 block text-sm text-slate-400">{detail}</span><span className={`mt-4 block h-10 rounded-lg ${value === "LIGHT" ? "bg-slate-100" : "bg-[#071018]"}`} /></label>)}</div></section><button onClick={save} disabled={saving} className="mt-7 rounded-xl bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 disabled:opacity-50"><Save size={17} className="mr-2 inline" />{saving ? "Guardando..." : "Guardar cambios"}</button></>}</section>;
}
