import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Copy, Download, Pencil, Plus, Printer, QrCode, RefreshCw, X } from "lucide-react";
import { adminRequest } from "./api";
import { printQr } from "./venuePrint";

const blank = { code: "", label: "", area: "TABLE", active: true };

function download(name, href) {
  const link = document.createElement("a");
  link.download = name;
  link.href = href;
  link.click();
}

export default function AdminVenues() {
  const [venues, setVenues] = useState([]);
  const [area, setArea] = useState("ALL");
  const [form, setForm] = useState(null);
  const [qrVenue, setQrVenue] = useState(null);
  const [qr, setQr] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [qrLoading, setQrLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try { setVenues(await adminRequest("/admin/venues")); }
    catch (reason) { setError(reason.message); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);
  useEffect(() => {
    if (!qrVenue?.publicUrl) return undefined;
    let active = true;
    setQrLoading(true);
    Promise.all([QRCode.toDataURL(qrVenue.publicUrl, { width: 900, margin: 2 }), QRCode.toString(qrVenue.publicUrl, { type: "svg", margin: 2 })])
      .then(([png, svg]) => { if (active) setQr({ png, svg }); })
      .catch((reason) => { if (active) setError(reason.message || "No se pudo generar el QR"); })
      .finally(() => { if (active) setQrLoading(false); });
    return () => { active = false; };
  }, [qrVenue]);

  function openQr(venue) { setError(""); setQr(null); setQrVenue(venue); }
  async function save(event) {
    event.preventDefault();
    setSaving(true); setError("");
    try {
      const value = form.id
        ? await adminRequest(`/admin/venues/${form.id}`, { method: "PUT", body: { label: form.label, area: form.area, active: form.active } })
        : await adminRequest("/admin/venues", { method: "POST", body: form });
      setNotice(form.id ? "Ubicación actualizada." : "Ubicación creada con su QR.");
      setForm(null);
      await load();
      if (!form.id) openQr(value);
    } catch (reason) { setError(reason.message); }
    finally { setSaving(false); }
  }
  async function toggleQr(venue) {
    setError("");
    try { await adminRequest(`/admin/venues/${venue.id}/qr`, { method: "PUT", body: { active: !venue.qr?.active } }); await load(); }
    catch (reason) { setError(reason.message); }
  }
  async function copyUrl(url) {
    try { await navigator.clipboard.writeText(url); setNotice("URL copiada."); }
    catch { setError("No se pudo copiar la URL"); }
  }
  function downloadSvg() {
    if (!qr) return;
    const url = URL.createObjectURL(new Blob([qr.svg], { type: "image/svg+xml" }));
    download(`${qrVenue.code}.svg`, url);
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }
  const filtered = venues.filter((venue) => area === "ALL" || venue.area === area);

  return <section>
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm text-cyan-300">UBICACIONES DEL LOCAL</p><h1 className="mt-1 text-3xl font-semibold">Mesas y barras</h1><p className="mt-2 text-sm text-slate-400">Los QR nuevos usan tokens opacos. Los códigos históricos siguen administrándose desde esta lista.</p></div><button onClick={() => setForm(blank)} className="rounded-xl bg-cyan-300 px-4 py-3 text-sm font-semibold text-slate-950"><Plus size={17} className="mr-2 inline" />Nueva ubicación</button></div>
    {error && <div className="mt-5 rounded-xl bg-rose-400/10 p-4 text-sm text-rose-200">{error}<button onClick={load} className="ml-3 underline">Reintentar</button></div>}{notice && <p className="mt-5 rounded-xl bg-emerald-400/10 p-4 text-sm text-emerald-200">{notice}</p>}
    <div className="mt-6 flex gap-3">{[["ALL", "Todas"], ["TABLE", "Mesas"], ["BAR", "Barras"]].map(([value, label]) => <button key={value} onClick={() => setArea(value)} className={`rounded-xl px-3 py-2 text-sm ${area === value ? "bg-cyan-300 text-slate-950" : "border border-white/10"}`}>{label}</button>)}</div>
    {form && <form onSubmit={save} className="mt-5 grid gap-4 rounded-2xl border border-cyan-300/20 bg-[#101720] p-5 md:grid-cols-2"><div className="flex items-center justify-between md:col-span-2"><h2 className="font-semibold">{form.id ? "Editar ubicación" : "Nueva ubicación"}</h2><button type="button" onClick={() => setForm(null)}><X size={18} /></button></div>{!form.id && <label className="text-sm">Código público estable<input required value={form.code} onChange={(event) => setForm({ ...form, code: event.target.value.toUpperCase() })} placeholder="M01 o B01" className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 p-3" /></label>}<label className="text-sm">Nombre visible<input required value={form.label} onChange={(event) => setForm({ ...form, label: event.target.value })} className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 p-3" /></label><label className="text-sm">Tipo<select value={form.area} onChange={(event) => setForm({ ...form, area: event.target.value })} className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 p-3"><option value="TABLE">Mesa</option><option value="BAR">Barra</option></select></label><label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={form.active} onChange={(event) => setForm({ ...form, active: event.target.checked })} />Ubicación activa</label><button disabled={saving} className="rounded-xl bg-cyan-300 px-4 py-3 font-semibold text-slate-950 disabled:opacity-50 md:col-span-2">{saving ? "Guardando..." : "Guardar ubicación"}</button></form>}
    {loading ? <div className="mt-8 flex items-center gap-3 text-slate-400"><RefreshCw className="animate-spin" size={18} />Cargando ubicaciones...</div> : <div className="mt-6 grid gap-3">{filtered.map((venue) => <article key={venue.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4"><div><h2 className="font-semibold">{venue.label}</h2><p className="mt-1 text-sm text-slate-400">{venue.area === "BAR" ? "Barra" : "Mesa"} · Código {venue.code} · {venue.active ? "Activa" : "Inactiva"} · QR {venue.qr?.active ? "activo" : "inactivo"}</p></div><div className="flex flex-wrap gap-2"><button onClick={() => setForm({ ...venue })} className="rounded-lg border border-white/10 p-2" title="Editar"><Pencil size={17} /></button><button onClick={() => toggleQr(venue)} className="rounded-lg border border-white/10 px-3 py-2 text-sm">QR {venue.qr?.active ? "Desactivar" : "Activar"}</button><button disabled={!venue.qr?.active} onClick={() => openQr(venue)} className="rounded-lg border border-white/10 p-2 disabled:opacity-40" title="Ver QR"><QrCode size={17} /></button></div></article>)}{!filtered.length && <p className="rounded-xl border border-dashed border-white/10 p-5 text-sm text-slate-400">No hay ubicaciones para este filtro.</p>}</div>}
    {qrVenue && <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4"><div className="w-full max-w-md rounded-2xl bg-[#101720] p-6"><div className="flex justify-between gap-3"><div><h2 className="text-xl font-semibold">{qrVenue.label}</h2><p className="text-sm text-slate-400">Código: {qrVenue.code}</p></div><button onClick={() => setQrVenue(null)}><X /></button></div>{qrLoading ? <div className="grid h-72 place-items-center"><RefreshCw className="animate-spin text-cyan-300" /></div> : qr && <><img src={qr.png} alt={`QR de ${qrVenue.label}`} className="mx-auto mt-5 w-72 max-w-full rounded-xl bg-white p-3" /><p className="mt-3 text-center text-sm text-slate-300">Escaneá para abrir el menú</p><div className="mt-5 flex flex-wrap justify-center gap-2"><button onClick={() => download(`${qrVenue.code}.png`, qr.png)} className="rounded-lg border border-white/10 px-3 py-2 text-sm"><Download size={16} className="mr-1 inline" />PNG</button><button onClick={downloadSvg} className="rounded-lg border border-white/10 px-3 py-2 text-sm"><Download size={16} className="mr-1 inline" />SVG</button><button onClick={() => printQr(qrVenue, qr)} className="rounded-lg border border-white/10 px-3 py-2 text-sm"><Printer size={16} className="mr-1 inline" />Imprimir</button><button onClick={() => copyUrl(qrVenue.publicUrl)} className="rounded-lg border border-white/10 px-3 py-2 text-sm"><Copy size={16} className="mr-1 inline" />Copiar URL</button></div></>}</div></div>}
  </section>;
}
