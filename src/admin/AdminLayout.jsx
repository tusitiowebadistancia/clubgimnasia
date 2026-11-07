import { useEffect, useState } from "react";
import { BarChart3, Clapperboard, ClipboardList, Home, LayoutDashboard, LogOut, Menu, PackageSearch, RefreshCw, Settings, TableProperties, Tag, X } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { adminRequest } from "./api";

const navigation = [{ to: "/admin", label: "Resumen", icon: LayoutDashboard, end: true }, { to: "/admin/productos", label: "Productos", icon: PackageSearch }, { to: "/admin/pedidos", label: "Pedidos", icon: ClipboardList }, { to: "/admin/promociones", label: "Promociones", icon: Tag }, { to: "/admin/publicidad", label: "Publicidad", icon: Clapperboard }, { to: "/admin/mesas", label: "Mesas y barras", icon: TableProperties }, { to: "/admin/configuracion", label: "Configuración", icon: Settings }, { to: "/admin/estadisticas", label: "Estadísticas", icon: BarChart3, disabled: true }];

export default function AdminLayout() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let active = true;
    adminRequest("/admin/auth/session").then((data) => active && setAdmin(data.admin)).catch(() => active && navigate("/admin/login", { replace: true }));
    return () => { active = false; };
  }, [navigate]);

  async function logout() {
    try {
      await adminRequest("/admin/auth/logout", { method: "POST" });
      navigate("/admin/login", { replace: true });
    } catch (requestError) { setError(requestError.message); }
  }

  function goHome() {
    setOpen(false);
    navigate("/");
  }

  if (!admin) return <main className="grid min-h-screen place-items-center bg-[#080b10] text-slate-300"><RefreshCw className="animate-spin text-cyan-300" /> <span className="sr-only">Validando sesión</span></main>;
  return <div className="min-h-screen bg-[#080b10] text-slate-100"><button onClick={() => setOpen(!open)} className="fixed right-4 top-4 z-30 rounded-xl border border-white/10 bg-[#121923] p-3 lg:hidden" aria-label="Abrir navegación">{open ? <X size={20} /> : <Menu size={20} />}</button><aside className={`fixed inset-y-0 left-0 z-20 flex w-72 flex-col border-r border-white/10 bg-[#0d131b] p-5 transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}><div className="px-3 py-5"><p className="text-xs font-semibold tracking-[0.24em] text-cyan-300">BOWLING CLUB</p><p className="mt-1 text-xl font-semibold">Administración</p></div><nav className="mt-5 space-y-1">{navigation.map(({ to, label, icon: Icon, end, disabled }) => disabled ? <span key={label} className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-600" title="Disponible en la próxima etapa"><Icon size={18} />{label}<small className="ml-auto text-[10px]">PRÓX.</small></span> : <NavLink key={to} to={to} end={end} onClick={() => setOpen(false)} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${isActive ? "bg-cyan-300 text-slate-950" : "text-slate-300 hover:bg-white/5"}`}><Icon size={18} />{label}</NavLink>)}</nav><div className="mt-auto border-t border-white/10 pt-4"><p className="truncate px-3 text-xs text-slate-500">{admin.email}</p>{error && <p className="mt-3 text-xs text-rose-300">{error}</p>}<button onClick={goHome} className="mt-3 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-cyan-300 transition hover:bg-cyan-300/10"><Home size={18} />Ir a inicio</button><button onClick={logout} className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-300 hover:bg-white/5"><LogOut size={18} />Cerrar sesión</button></div></aside><main className="min-h-screen px-5 pb-10 pt-20 lg:ml-72 lg:px-10 lg:pt-10"><Outlet context={{ admin }} /></main></div>;
}
