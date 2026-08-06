import { Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck, ShoppingBag, Trophy, Truck } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

export function LogoGoogle() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 shrink-0">
      <path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.4-.18-2.07H12v3.91h5.38a4.6 4.6 0 0 1-2 3.02v2.54h3.24c1.9-1.75 2.98-4.33 2.98-7.4Z" />
      <path fill="#34A853" d="M12 22c2.7 0 4.97-.9 6.62-2.37l-3.24-2.54c-.9.6-2.05.96-3.38.96-2.6 0-4.8-1.76-5.59-4.12H3.07v2.62A10 10 0 0 0 12 22Z" />
      <path fill="#FBBC05" d="M6.41 13.93A6 6 0 0 1 6.1 12c0-.67.12-1.32.31-1.93V7.45H3.07A10 10 0 0 0 2 12c0 1.62.39 3.15 1.07 4.55l3.34-2.62Z" />
      <path fill="#EA4335" d="M12 5.95c1.47 0 2.79.5 3.83 1.5l2.87-2.87A9.62 9.62 0 0 0 12 2a10 10 0 0 0-8.93 5.45l3.34 2.62C7.2 7.71 9.4 5.95 12 5.95Z" />
    </svg>
  );
}

export default function EstiloAutentificacion({ etiqueta, titulo, subtitulo, children }) {
  const reducirMovimiento = useReducedMotion();

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />

      <div className="relative mx-auto grid min-h-screen max-w-[1500px] lg:grid-cols-[0.9fr_1.1fr]">
        <section className="relative hidden overflow-hidden border-r border-slate-800 bg-gradient-to-br from-slate-900/80 via-slate-950 to-blue-950/30 p-12 lg:flex lg:flex-col lg:justify-between xl:p-16">
          <Link to="/" className="inline-flex w-fit items-center gap-2.5 text-xl font-black tracking-tight">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg shadow-blue-600/20"><Trophy size={20} /></span>
            <span>Sport<span className="text-blue-400">Hub</span></span>
          </Link>

          <motion.div
            initial={reducirMovimiento ? false : { opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="max-w-lg"
          >
            <span className="text-sm font-bold uppercase tracking-[0.22em] text-blue-400">Tu deporte, tu cuenta</span>
            <h2 className="mt-5 text-4xl font-black leading-tight tracking-tight xl:text-5xl">Todo listo para tu próxima jugada.</h2>
            <p className="mt-5 max-w-md text-lg leading-8 text-slate-400">Guarda tus compras, consulta tus pedidos y disfruta una experiencia más rápida en SportHub.</p>

            <div className="mt-10 space-y-4 text-sm text-slate-300">
              <div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400"><ShieldCheck size={18} /></span>Acceso y compras protegidas</div>
              <div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400"><ShoppingBag size={18} /></span>Historial de compras en un solo lugar</div>
              <div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400"><Truck size={18} /></span>Seguimiento sencillo de tus pedidos</div>
            </div>
          </motion.div>

          <p className="text-xs text-slate-600">© 2026 SportHub · Vive el deporte a tu manera.</p>
        </section>

        <section className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-8 lg:px-12">
          <motion.div
            initial={reducirMovimiento ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: reducirMovimiento ? 0 : 0.08, ease: "easeOut" }}
            className="w-full max-w-md"
          >
            <div className="mb-8 flex items-center justify-between lg:hidden">
              <Link to="/" className="flex items-center gap-2 text-lg font-black"><Trophy size={20} className="text-blue-400" /> Sport<span className="-ml-2 text-blue-400">Hub</span></Link>
              <Link to="/" className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"><ArrowLeft size={16} /> Inicio</Link>
            </div>

            <Link to="/" className="mb-7 hidden w-fit items-center gap-2 text-sm text-slate-500 transition hover:text-blue-400 lg:flex"><ArrowLeft size={16} /> Volver a la tienda</Link>
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-blue-400">{etiqueta}</span>
            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">{titulo}</h1>
            <p className="mt-3 text-sm leading-6 text-slate-400">{subtitulo}</p>
            <div className="mt-8">{children}</div>
          </motion.div>
        </section>
      </div>
    </main>
  );
}
