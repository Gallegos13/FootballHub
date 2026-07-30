import { useAuth } from "./autentificación.jsx";
import { Link } from "react-router-dom";
import { ClipboardList, ArrowLeft, Package } from "lucide-react";
import { getCompras } from "./comprasstore.js";

function MisCompras() {
  const { user } = useAuth();
  const compras = user ? getCompras(user.email) : [];

  return (
    <div className="min-h-screen bg-slate-900 text-white pt-24 px-6 pb-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-8">
          <Link to="/" className="text-slate-400 hover:text-white transition">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-bold">Mis compras</h1>
        </div>

        {!user && (
          <div className="flex flex-col items-center justify-center py-20">
            <ClipboardList size={64} className="text-slate-600 mb-6" />
            <p className="text-slate-400 mb-4">Inicia sesión para ver tus compras</p>
            <Link to="/iniciodesesión" className="rounded-xl bg-blue-600 px-5 py-2 font-semibold text-white transition hover:bg-blue-500">
              Iniciar sesión
            </Link>
          </div>
        )}

        {user && compras.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <Package size={64} className="text-slate-600 mb-6" />
            <p className="text-slate-400 mb-2 text-lg">No tienes compras aún</p>
            <p className="text-slate-500 mb-6">Tus compras aparecerán aquí después de pagar.</p>
            <Link to="/" className="text-blue-400 hover:text-blue-300 transition">
              Explorar productos
            </Link>
          </div>
        )}

        {user && compras.length > 0 && (
          <div className="space-y-4">
            {[...compras].reverse().map((compra) => (
              <div key={compra.id} className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-slate-400">
                    {new Date(compra.fecha).toLocaleDateString("es-MX", {
                      year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
                    })}
                  </span>
                  <span className="text-sm font-mono text-slate-500">#{compra.id}</span>
                </div>

                <div className="space-y-3">
                  {compra.articulos.map((art, i) => (
                    <div key={i} className="flex items-center gap-4 bg-slate-800/50 rounded-xl p-3">
                      <img src={art.imagen} alt={art.nombre} className="w-14 h-14 object-contain rounded-lg bg-slate-950" />
                      <div className="flex-1">
                        <p className="font-medium">{art.nombre}</p>
                        {art.talla && <p className="text-xs text-slate-400">Talla: {art.talla}</p>}
                      </div>
                      <p className="font-semibold text-emerald-400">${Number(art.precio).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700">
                  <span className="text-sm text-slate-400">
                    {compra.marca} •••• {compra.ultimos4}
                  </span>
                  <span className="text-xl font-bold text-emerald-400">
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