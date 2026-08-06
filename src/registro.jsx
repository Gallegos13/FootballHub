import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle, ArrowRight, CheckCircle2, Eye, EyeOff, LoaderCircle, LockKeyhole, Mail } from "lucide-react";
import { useAuth } from "./autentificación.jsx";
import EstiloAutentificacion from "./estiloautentificacion.jsx";

function Registro() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const fuerza = useMemo(() => [password.length >= 6, password.length >= 10, /[A-Z]/.test(password), /\d|[^A-Za-z0-9]/.test(password)].filter(Boolean).length, [password]);
  const coincide = confirmarPassword && password === confirmarPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");
    if (password !== confirmarPassword) return setError("Las contraseñas no coinciden.");
    if (password.length < 6) return setError("La contraseña debe tener al menos 6 caracteres.");
    setLoading(true);
    const { error } = await signUp(correo, password);
    if (error) {
      setError("No pudimos crear tu cuenta. Verifica los datos e intenta nuevamente.");
      setLoading(false);
      return;
    }
    setMensaje("Cuenta creada. Revisa tu correo para confirmar el registro.");
    setTimeout(() => navigate("/iniciodesesión"), 2500);
  };

  return (
    <EstiloAutentificacion etiqueta="Únete a SportHub" titulo="Crea tu cuenta" subtitulo="Regístrate para guardar tus compras y agilizar tus próximos pedidos.">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div role="alert" className="flex items-start gap-3 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-300"><AlertCircle size={18} className="mt-0.5 shrink-0" />{error}</div>}
        {mensaje && <div role="status" className="flex items-start gap-3 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300"><CheckCircle2 size={18} className="mt-0.5 shrink-0" />{mensaje}</div>}

        <div>
          <label htmlFor="register-email" className="mb-2 block text-sm font-semibold text-slate-300">Correo electrónico</label>
          <div className="relative"><Mail size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" /><input id="register-email" type="email" autoComplete="email" required placeholder="tu@correo.com" value={correo} onChange={(e) => setCorreo(e.target.value)} className="w-full rounded-xl border border-slate-800 bg-slate-900/70 py-3.5 pl-11 pr-4 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" /></div>
        </div>

        <div>
          <label htmlFor="register-password" className="mb-2 block text-sm font-semibold text-slate-300">Contraseña</label>
          <div className="relative">
            <LockKeyhole size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input id="register-password" type={mostrarPassword ? "text" : "password"} autoComplete="new-password" required placeholder="Mínimo 6 caracteres" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-slate-800 bg-slate-900/70 py-3.5 pl-11 pr-12 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" />
            <button type="button" onClick={() => setMostrarPassword(!mostrarPassword)} aria-label={mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-500 transition hover:bg-slate-800 hover:text-white">{mostrarPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
          </div>
          {password && <div className="mt-2"><div className="grid grid-cols-4 gap-1.5">{[1,2,3,4].map((nivel) => <span key={nivel} className={`h-1 rounded-full transition-colors ${nivel <= fuerza ? fuerza <= 1 ? 'bg-red-400' : fuerza <= 2 ? 'bg-amber-400' : 'bg-emerald-400' : 'bg-slate-800'}`} />)}</div><p className="mt-1.5 text-xs text-slate-500">{fuerza <= 1 ? 'Contraseña débil' : fuerza <= 2 ? 'Contraseña aceptable' : 'Contraseña segura'}</p></div>}
        </div>

        <div>
          <label htmlFor="register-confirm" className="mb-2 block text-sm font-semibold text-slate-300">Confirmar contraseña</label>
          <div className="relative"><LockKeyhole size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" /><input id="register-confirm" type={mostrarPassword ? "text" : "password"} autoComplete="new-password" required placeholder="Repite tu contraseña" value={confirmarPassword} onChange={(e) => setConfirmarPassword(e.target.value)} className={`w-full rounded-xl border bg-slate-900/70 py-3.5 pl-11 pr-11 text-white outline-none transition placeholder:text-slate-600 focus:ring-4 ${confirmarPassword && !coincide ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500/10' : 'border-slate-800 focus:border-blue-500 focus:ring-blue-500/10'}`} />{coincide && <CheckCircle2 size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400" />}</div>
          {confirmarPassword && !coincide && <p className="mt-1.5 text-xs text-red-400">Las contraseñas todavía no coinciden.</p>}
        </div>

        <button disabled={loading} className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 font-bold text-white shadow-lg shadow-blue-600/10 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60">{loading ? <><LoaderCircle size={19} className="animate-spin" /> Creando cuenta...</> : <>Crear cuenta <ArrowRight size={18} /></>}</button>
        <p className="pt-2 text-center text-sm text-slate-400">¿Ya tienes cuenta? <Link to="/iniciodesesión" className="font-semibold text-blue-400 transition hover:text-blue-300">Inicia sesión</Link></p>
      </form>
    </EstiloAutentificacion>
  );
}

export default Registro;
