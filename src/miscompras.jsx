import { useAuth } from "./autentificación.jsx";
import { Link } from "react-router-dom";
import { ClipboardList, Package, ArrowLeft, CreditCard } from "lucide-react";
import { getCompras } from "./comprasstore.js";

function MisCompras() {
  const { user } = useAuth();
  const compras = user ? getCompras(user.email) : [];

  return (
    <div className="min-h-screen bg-slate-950 pt-24 px-6 pb-10 text-white">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 sm:mb-10 flex items-start sm:items-center gap-3 sm:gap-4">
          <Link to="/" className="mt-1 sm:mt-0 flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-all duration-300">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black">Mis compras</h1>
            {user && (
              <p className="mt-1 sm:mt-2 text-sm sm:text-base text-slate-400">{compras.length} compra{compras.length !== 1 && "s"}</p>
            )}
          </div>
        </div>

        {!user && (
          <div className="mx-auto flex max-w-xl flex-col items-center rounded-3xl border border-slate-800 bg-slate-900 p-8 sm:p-12 text-center">
            <ClipboardList size={60} className="mb-5 sm:mb-6 text-emerald-400" />
            <h2 className="text-2xl sm:text-3xl font-black">Inicia sesión</h2>
            <p className="mt-3 text-slate-400 mb-6">Inicia sesión para ver tus compras realizadas.</p>
            <Link to="/iniciodesesión" className="rounded-2xl bg-emerald-500 px-8 py-3 font-semibold text-white transition-all duration-300 hover:bg-emerald-600 hover:scale-[1.02] active:scale-95">
              Iniciar sesión
            </Link>
          </div>
        )}

        {user && compras.length === 0 && (
          <div className="mx-auto flex max-w-xl flex-col items-center rounded-3xl border border-slate-800 bg-slate-900 p-8 sm:p-12 text-center">
            <Package size={60} className="mb-5 sm:mb-6 text-emerald-400" />
            <h2 className="text-2xl sm:text-3xl font-black">No tienes compras aún</h2>
            <p className="mt-3 text-slate-400 mb-6">Tus compras aparecerán aquí después de realizar un pago exitoso.</p>
            <Link to="/" className="rounded-2xl bg-emerald-500 px-8 py-3 font-semibold text-white transition-all duration-300 hover:bg-emerald-600 hover:scale-[1.02] active:scale-95">
              Explorar productos
            </Link>
          </div>
        )}

        {user && compras.length > 0 && (
          <div className="space-y-6">
            {[...compras].reverse().map((compra) => (
              <div
                key={compra.id}
                className="rounded-3xl border border-slate-700 bg-slate-900 p-6 transition-all duration-300 hover:border-blue-400/82"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4 sm:mb-5">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-emerald-500/10 shrink-0">
                      <CreditCard size={16} className="text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-slate-400">
                        {new Date(compra.fecha).toLocaleDateString("es-MX", {
                          year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-slate-800 px-2.5 sm:px-3 py-1 text-xs font-mono text-slate-400">#{compra.id}</span>
                </div>

                <div className="space-y-2 sm:space-y-3">
                  {compra.articulos.map((art, i) => (
                    <div key={i} className="flex items-center gap-3 sm:gap-4 rounded-2xl bg-slate-800/50 p-2.5 sm:p-3 transition-all duration-300 hover:bg-slate-800">
                      <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-xl bg-slate-950 shrink-0">
                        <img src={art.imagen} alt={art.nombre} className="h-10 w-10 sm:h-12 sm:w-12 object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm sm:text-base truncate">{art.nombre}</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {art.talla && <>Talla: {art.talla} · </>}
                          Cantidad: {art.cantidad || 1}
                        </p>
                      </div>
                      <p className="text-lg sm:text-xl font-black text-emerald-400 whitespace-nowrap">${(Number(art.precio) * (art.cantidad || 1)).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 sm:mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800 pt-4 sm:pt-5">
                  <span className="flex items-center gap-2 text-xs sm:text-sm text-slate-400">
                    {compra.marca} <span className="text-slate-600">••••</span> {compra.ultimos4}
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-emerald-400 whitespace-nowrap">
                    ${Number(compra.total).toFixed(2)} MXN
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MisCompras;
