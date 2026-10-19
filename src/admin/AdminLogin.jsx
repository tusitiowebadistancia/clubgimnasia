import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LockKeyhole, LogIn } from "lucide-react";
import { adminRequest } from "./api";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setSending(true);
    try {
      await adminRequest("/admin/auth/login", { method: "POST", body: { email, password } });
      navigate("/admin", { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSending(false);
    }
  }

  return <main className="min-h-screen bg-[#080b10] px-5 py-10 text-slate-100"><div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-[#10151d] shadow-2xl shadow-black/40 md:grid-cols-[1.1fr_.9fr]"><section className="hidden bg-[radial-gradient(circle_at_top_left,_#31526b,_transparent_55%),linear-gradient(145deg,#152631,#091016)] p-12 md:flex md:flex-col md:justify-between"><div><p className="text-xs font-semibold tracking-[0.3em] text-cyan-300">BOWLING CLUB GIMNASIA</p><h1 className="mt-6 text-5xl font-semibold leading-tight">Operación clara.<br />Catálogo oficial.</h1></div><p className="max-w-sm text-sm leading-6 text-slate-300">Acceso reservado para el equipo del local. Los precios y productos se reciben exclusivamente desde NegoPlus.</p></section><section className="flex items-center p-7 sm:p-12"><form className="w-full" onSubmit={submit}><div className="mb-10"><div className="mb-5 inline-flex rounded-2xl bg-cyan-400/10 p-3 text-cyan-300"><LockKeyhole size={25} /></div><p className="text-xs font-semibold tracking-[0.25em] text-cyan-300 md:hidden">BOWLING CLUB GIMNASIA</p><h2 className="mt-3 text-3xl font-semibold">Panel administrativo</h2><p className="mt-2 text-sm text-slate-400">Ingresá con tu cuenta autorizada.</p></div>{error && <p className="mb-5 rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-200" role="alert">{error}</p>}<label className="block text-sm font-medium text-slate-300">Correo electrónico<input value={email} onChange={(event) => setEmail(event.target.value)} type="email" autoComplete="email" required className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none transition focus:border-cyan-300" /></label><label className="mt-5 block text-sm font-medium text-slate-300">Contraseña<input value={password} onChange={(event) => setPassword(event.target.value)} type="password" autoComplete="current-password" required minLength="12" className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none transition focus:border-cyan-300" /></label><button disabled={sending} className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-300 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-wait disabled:opacity-60"><LogIn size={18} />{sending ? "Validando…" : "Ingresar al panel"}</button></form></section></div></main>;
}
