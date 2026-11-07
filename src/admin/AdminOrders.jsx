import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ClipboardList, RefreshCw, Search, X } from "lucide-react";
import { adminRequest } from "./api";

const currency = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" });
const statusLabels = { PENDING: "Pendiente", CONFIRMED: "Confirmado", PREPARING: "Preparando", READY: "Listo", DELIVERED: "Entregado", CANCELLED: "Cancelado" };
const statusStyles = { PENDING: "text-amber-200 border-amber-300/30 bg-amber-300/10", CONFIRMED: "text-cyan-200 border-cyan-300/30 bg-cyan-300/10", PREPARING: "text-violet-200 border-violet-300/30 bg-violet-300/10", READY: "text-emerald-200 border-emerald-300/30 bg-emerald-300/10", DELIVERED: "text-slate-300 border-white/15 bg-white/5", CANCELLED: "text-rose-200 border-rose-300/30 bg-rose-300/10" };
const statusActions = { PENDING: [{ status: "CONFIRMED", label: "Confirmar" }, { status: "CANCELLED", label: "Cancelar" }], CONFIRMED: [{ status: "PREPARING", label: "Preparar" }, { status: "CANCELLED", label: "Cancelar" }], PREPARING: [{ status: "READY", label: "Marcar listo" }, { status: "CANCELLED", label: "Cancelar" }], READY: [{ status: "DELIVERED", label: "Entregar" }, { status: "CANCELLED", label: "Cancelar" }], DELIVERED: [], CANCELLED: [] };
const argentinaOffset = new Intl.DateTimeFormat("en-US", { timeZone: "America/Argentina/Buenos_Aires", timeZoneName: "longOffset" });

function argentinaDayIso(value, endOfDay) {
  const [year, month, day] = value.split("-").map(Number); const hours = endOfDay ? 23 : 0; const minutes = endOfDay ? 59 : 0; const seconds = endOfDay ? 59 : 0; const milliseconds = endOfDay ? 999 : 0; const naive = Date.UTC(year, month - 1, day, hours, minutes, seconds, milliseconds);
  const zone = argentinaOffset.formatToParts(new Date(naive)).find((part) => part.type === "timeZoneName")?.value ?? "GMT-03:00"; const match = zone.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/); const offset = match ? (match[1] === "+" ? 1 : -1) * (Number(match[2]) * 60 + Number(match[3] ?? 0)) * 60_000 : -3 * 60 * 60_000;
  return new Date(naive - offset).toISOString();
}

function queryString(filters, page) {
  const query = new URLSearchParams({ page: String(page), pageSize: "20" });
  Object.entries(filters).forEach(([key, value]) => {
    if (!value) return;
    if (key === "from") query.set(key, argentinaDayIso(value, false));
    else if (key === "to") query.set(key, argentinaDayIso(value, true));
    else query.set(key, value);
  });
  return query.toString();
}

function Status({ value }) {
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyles[value]}`}>{statusLabels[value]}</span>;
}

export default function AdminOrders() {
  const [draft, setDraft] = useState({ status: "", orderNumber: "", mesa: "", from: "", to: "" });
  const [filters, setFilters] = useState(draft); const [page, setPage] = useState(1); const [data, setData] = useState(null); const [error, setError] = useState(null); const [reload, setReload] = useState(0); const [detailOpen, setDetailOpen] = useState(false); const [detailLoading, setDetailLoading] = useState(false); const [detail, setDetail] = useState(null); const [detailError, setDetailError] = useState(""); const [statusSaving, setStatusSaving] = useState(false); const [statusMessage, setStatusMessage] = useState(""); const listRequest = useRef(0); const detailRequest = useRef(0); const statusRequest = useRef(0);
  const requestQuery = queryString(filters, page);

  useEffect(() => {
    const controller = new AbortController(); const request = ++listRequest.current;
    adminRequest(`/admin/orders?${requestQuery}`, { signal: controller.signal }).then((value) => { if (request === listRequest.current) setData({ query: requestQuery, value }); }).catch((reason) => { if (reason.name !== "AbortError" && request === listRequest.current) setError({ query: requestQuery, message: reason.message }); });
    return () => controller.abort();
  }, [requestQuery, reload]);

  async function openDetail(id, preserveStatusMessage = false, force = false) {
    if (statusSaving && !force) return;
    const request = ++detailRequest.current; setDetailOpen(true); setDetailLoading(true); setDetailError(""); if (!preserveStatusMessage) setStatusMessage(""); setDetail(null);
    try { const value = await adminRequest(`/admin/orders/${id}`); if (request === detailRequest.current) setDetail(value); } catch (reason) { if (request === detailRequest.current) setDetailError(reason.message); } finally { if (request === detailRequest.current) setDetailLoading(false); }
  }

  function closeDetail() { if (statusSaving) return; detailRequest.current += 1; statusRequest.current += 1; setDetailOpen(false); setDetailLoading(false); setDetail(null); setDetailError(""); }

  async function updateStatus(status) {
    if (!detail || statusSaving) return;
    if (status === "CANCELLED" && !window.confirm("¿Cancelar este pedido? Esta acción no se puede revertir.")) return;
    const request = ++statusRequest.current; const orderId = detail.id; setStatusSaving(true); setStatusMessage("");
    try { const saved = await adminRequest(`/admin/orders/${orderId}/status`, { method: "PATCH", body: { status } }); if (request !== statusRequest.current) return; setDetail((current) => current?.id === saved.id ? { ...current, ...saved } : current); setStatusMessage(`Pedido ${statusLabels[saved.status].toLowerCase()}.`); setReload((value) => value + 1); } catch (reason) { if (request !== statusRequest.current) return; const conflict = reason.status === 409; setStatusMessage(conflict ? "El estado cambió o la transición ya no está disponible. Se actualizó el detalle." : reason.message); if (conflict) openDetail(orderId, true, true); } finally { if (request === statusRequest.current) setStatusSaving(false); }
  }

  function applyFilters(event) { event.preventDefault(); setPage(1); setFilters(draft); }
  const visibleData = data?.query === requestQuery ? data.value : null; const visibleError = error?.query === requestQuery ? error.message : ""; const totalPages = visibleData ? Math.max(1, Math.ceil(visibleData.total / visibleData.pageSize)) : 1;

  return <section>
    <p className="text-sm text-cyan-300">OPERACIÓN</p><h1 className="mt-1 text-3xl font-semibold">Pedidos</h1><p className="mt-2 text-sm text-slate-400">Consultá pedidos registrados y sus importes históricos.</p>
    <form onSubmit={applyFilters} className="mt-6 grid gap-3 rounded-2xl border border-white/10 bg-[#101720] p-4 sm:grid-cols-2 lg:grid-cols-6"><select value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value })} className="rounded-lg border border-white/10 bg-black/20 p-2 text-sm"><option value="">Todos los estados</option>{Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><input value={draft.orderNumber} onChange={(event) => setDraft({ ...draft, orderNumber: event.target.value })} placeholder="N.º de pedido" className="rounded-lg border border-white/10 bg-black/20 p-2 text-sm" /><input value={draft.mesa} onChange={(event) => setDraft({ ...draft, mesa: event.target.value })} placeholder="Mesa" className="rounded-lg border border-white/10 bg-black/20 p-2 text-sm" /><input type="date" value={draft.from} onChange={(event) => setDraft({ ...draft, from: event.target.value })} className="rounded-lg border border-white/10 bg-black/20 p-2 text-sm" /><input type="date" value={draft.to} onChange={(event) => setDraft({ ...draft, to: event.target.value })} className="rounded-lg border border-white/10 bg-black/20 p-2 text-sm" /><button className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-300 px-3 py-2 text-sm font-semibold text-slate-950"><Search size={16} />Filtrar</button></form>
    {visibleError ? <div className="mt-6 rounded-xl bg-rose-400/10 p-4 text-rose-200">{visibleError}<button onClick={() => setReload((value) => value + 1)} className="ml-3 underline">Reintentar</button></div> : !visibleData ? <div className="mt-6 flex gap-3 text-slate-400"><RefreshCw className="animate-spin" size={18} />Cargando pedidos...</div> : <><div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-[#101720]"><div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left text-sm"><thead className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-500"><tr><th className="p-4">Pedido</th><th className="p-4">Mesa</th><th className="p-4">Estado</th><th className="p-4">Fecha</th><th className="p-4">Artículos</th><th className="p-4 text-right">Total</th></tr></thead><tbody>{visibleData.orders.map((order) => <tr key={order.id} onClick={() => openDetail(order.id)} className="cursor-pointer border-b border-white/5 transition hover:bg-white/[0.03]"><td className="p-4 font-semibold text-cyan-200">{order.orderNumber}</td><td className="p-4">{order.venueLabel || order.venueCode || "Sin mesa"}</td><td className="p-4"><Status value={order.status} /></td><td className="p-4 text-slate-400">{new Date(order.createdAt).toLocaleString("es-AR")}</td><td className="p-4 text-slate-400">{order.itemCount}</td><td className="p-4 text-right font-semibold">{currency.format(Number(order.total))}</td></tr>)}</tbody></table></div>{!visibleData.orders.length && <div className="p-8 text-center text-sm text-slate-400"><ClipboardList className="mx-auto mb-3" size={24} />No hay pedidos para estos filtros.</div>}</div><div className="mt-4 flex items-center justify-between text-sm text-slate-400"><span>Página {visibleData.page} de {totalPages} · {visibleData.total} pedidos</span><div className="flex gap-2"><button disabled={page === 1} onClick={() => setPage(page - 1)} className="rounded-lg border border-white/10 p-2 disabled:opacity-40"><ChevronLeft size={18} /></button><button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="rounded-lg border border-white/10 p-2 disabled:opacity-40"><ChevronRight size={18} /></button></div></div></>}
    {detailOpen && <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4"><article className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-[#101720] p-6"><button onClick={closeDetail} className="float-right rounded-lg p-2 text-slate-400 hover:bg-white/5"><X size={20} /></button>{detailLoading ? <div className="flex gap-3 text-slate-400"><RefreshCw className="animate-spin" size={18} />Cargando detalle...</div> : detailError ? <p className="text-rose-300">{detailError}</p> : detail && <><p className="text-xs font-semibold tracking-[0.2em] text-cyan-300">{detail.orderNumber}</p><div className="mt-2 flex flex-wrap items-center gap-3"><h2 className="text-2xl font-semibold">Pedido</h2><Status value={detail.status} /></div><p className="mt-2 text-sm text-slate-400">{detail.venueLabel || detail.venueCode || "Sin mesa"} · {new Date(detail.createdAt).toLocaleString("es-AR")}</p>{statusMessage && <p role="alert" className={`mt-4 text-sm ${statusMessage.includes("cambió") || statusMessage.includes("no está") ? "text-rose-300" : "text-emerald-300"}`}>{statusMessage}</p>}{statusActions[detail.status].length > 0 && <div className="mt-5 flex flex-wrap gap-2">{statusActions[detail.status].map((action) => <button key={action.status} disabled={statusSaving} onClick={() => updateStatus(action.status)} className={`rounded-lg px-3 py-2 text-sm font-semibold disabled:opacity-50 ${action.status === "CANCELLED" ? "border border-rose-300/40 text-rose-200" : "bg-cyan-300 text-slate-950"}`}>{statusSaving ? "Guardando..." : action.label}</button>)}</div>}<div className="mt-6 space-y-3">{detail.items.map((item) => <div key={`${item.productId}-${item.productName}`} className="flex items-start justify-between gap-4 border-b border-white/10 pb-3"><div><p className="font-medium">{item.productName}</p><p className="text-sm text-slate-400">{item.quantity} × {currency.format(Number(item.unitPrice))}</p></div><p className="font-semibold">{currency.format(Number(item.lineTotal))}</p></div>)}</div><div className="mt-6 border-t border-white/10 pt-4 text-right"><p className="text-sm text-slate-400">Subtotal: {currency.format(Number(detail.subtotal))}</p><p className="mt-1 text-xl font-semibold text-cyan-200">Total: {currency.format(Number(detail.total))}</p></div></>}</article></div>}
  </section>;
}
