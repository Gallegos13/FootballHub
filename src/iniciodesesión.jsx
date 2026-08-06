import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AlertCircle, ArrowRight, Eye, EyeOff, LoaderCircle, LockKeyhole, Mail } from "lucide-react";
import { useAuth } from "./autentificación.jsx";
import EstiloAutentificacion, { LogoGoogle } from "./estiloautentificacion.jsx";

function Iniciosesión() {
  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await signIn(correo, password);
    if (error) {
      setError("No pudimos iniciar sesión. Revisa tu correo y contraseña.");
      setLoading(false);
      return;
    }
    navigate("/");
  };

  const handleGoogle = async () => {
    setError("");
    setGoogleLoading(true);
    const { error } = await signInWithGoogle();
    if (error) {
      setError("No pudimos conectar con Google. Intenta nuevamente.");
      setGoogleLoading(false);
    }
  };

  return (
    <EstiloAutentificacion etiqueta="Bienvenido de vuelta" titulo="Inicia sesión" subtitulo="Accede a tus compras y continúa donde lo dejaste.">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div role="alert" className="flex items-start gap-3 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            <AlertCircle size={18} className="mt-0.5 shrink-0" /> {error}
          </div>
        )}

        <div>
          <label htmlFor="login-email" className="mb-2 block text-sm font-semibold text-slate-300">Correo electrónico</label>
          <div className="relative">
            <Mail size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input id="login-email" type="email" autoComplete="email" required placeholder="tu@correo.com" value={correo} onChange={(e) => setCorreo(e.target.value)} className="w-full rounded-xl border border-slate-800 bg-slate-900/70 py-3.5 pl-11 pr-4 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" />
          </div>
        </div>

        <div>
          <label htmlFor="login-password" className="mb-2 block text-sm font-semibold text-slate-300">Contraseña</label>
          <div className="relative">
            <LockKeyhole size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input id="login-password" type={mostrarPassword ? "text" : "password"} autoComplete="current-password" required placeholder="Tu contraseña" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-slate-800 bg-slate-900/70 py-3.5 pl-11 pr-12 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" />
            <button type="button" onClick={() => setMostrarPassword(!mostrarPassword)} aria-label={mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-500 transition hover:bg-slate-800 hover:text-white">
              {mostrarPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button disabled={loading || googleLoading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 font-bold text-white shadow-lg shadow-blue-600/10 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60">
          {loading ? <><LoaderCircle size={19} className="animate-spin" /> Ingresando...</> : <>Entrar <ArrowRight size={18} /></>}
        </button>

        <div className="flex items-center gap-3 py-1"><span className="h-px flex-1 bg-slate-800" /><span className="text-xs uppercase tracking-widest text-slate-600">o continúa con</span><span className="h-px flex-1 bg-slate-800" /></div>

        <button type="button" onClick={handleGoogle} disabled={loading || googleLoading} className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-700 bg-white px-5 py-3.5 font-semibold text-slate-900 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60">
          {googleLoading ? <LoaderCircle size={19} className="animate-spin" /> : <LogoGoogle />}
          Iniciar con Google
        </button>

        <p className="pt-1 text-center text-sm text-slate-400">¿No tienes cuenta? <Link to="/Registro" className="font-semibold text-blue-400 transition hover:text-blue-300">Crear cuenta</Link></p>
      </form>
    </EstiloAutentificacion>
  );
}

export default Iniciosesión;
