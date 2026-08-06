import { useState } from "react";
import { AlertCircle, Minus, Plus, ShieldCheck, ShoppingBag, Trash2, Undo2, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./autentificación.jsx";

function Carrito({ cart, vaciarCarrito, quitarDelCarrito, restaurarAlCarrito, cambiarCantidad, cambiarTalla }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const reducirMovimiento = useReducedMotion();
  const [confirmarVaciado, setConfirmarVaciado] = useState(false);

  const unidades = cart.reduce((total, item) => total + item.cantidad, 0);
  const total = cart.reduce((suma, item) => suma + Number(item.precio) * item.cantidad, 0);
  const faltanTallas = cart.some((item) => item.tallas && !item.tallaSeleccionada);
  const itemsOrdenados = cart
    .map((item, index) => ({ item, index }))
    .sort((a, b) => (b.item.agregadoEn || 0) - (a.item.agregadoEn || 0));

  const eliminar = (item, index) => {
    quitarDelCarrito(index);
    toast.custom((identificador) => (
      <div className="flex w-full max-w-sm items-center gap-3 rounded-2xl border border-slate-700 bg-slate-900 p-4 text-white shadow-2xl shadow-black/30">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-400"><Trash2 size={18} /></div>
        <div className="min-w-0 flex-1"><p className="text-sm font-bold">Producto eliminado</p><p className="mt-0.5 truncate text-xs text-slate-400">{item.nombre}</p></div>
        <button onClick={() => { restaurarAlCarrito(item, index); toast.dismiss(identificador); }} className="flex shrink-0 items-center gap-1.5 rounded-xl border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-blue-500 hover:bg-blue-500/10 hover:text-blue-300"><Undo2 size={14} />Deshacer</button>
      </div>
    ), { duration: 5000 });
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 px-6 pt-32 text-white">
        <div className="mx-auto flex max-w-xl flex-col items-center rounded-3xl border border-slate-800 bg-slate-900/70 p-10 text-center shadow-2xl shadow-black/10 sm:p-12">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-500/10 text-emerald-400"><ShoppingBag size={42} /></div>
          <h1 className="mt-7 text-3xl font-black sm:text-4xl">Tu carrito está vacío</h1>
          <p className="mt-4 max-w-sm text-slate-400">Los productos que agregues aparecerán aquí para que puedas revisar tu compra.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 pb-16 pt-28 text-white sm:px-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 sm:mb-10">
          <span className="text-sm font-bold uppercase tracking-[0.22em] text-blue-400">Tu selección</span>
          <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">Carrito</h1>
          <p className="mt-2 text-slate-400">{unidades} unidad{unidades !== 1 && "es"} en {cart.length} producto{cart.length !== 1 && "s"}</p>
        </header>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_378px]">
          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {itemsOrdenados.map(({ item, index }) => {
                const subtotal = Number(item.precio) * item.cantidad;
                const unidadesProducto = cart.filter((otro) => otro.id === item.id).reduce((suma, otro) => suma + otro.cantidad, 0);
                const pocasUnidades = item.stock !== undefined && item.stock - unidadesProducto <= 3;
                const stockRestante = item.stock !== undefined ? Math.max(0, item.stock - unidadesProducto) : null;
                const stockCompleto = item.stock !== undefined && unidadesProducto >= item.stock;
                const tallas = item.tallas ? item.tallas.split(",").map((talla) => talla.trim()) : [];

                return (
                  <motion.article
                    key={`${item.id}-${item.agregadoEn}`}
                    initial={reducirMovimiento ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reducirMovimiento ? { opacity: 0 } : { opacity: 0, x: -24 }}
                    className="rounded-3xl border border-slate-800 bg-slate-900/70 p-4 transition-colors hover:border-slate-700 sm:p-5"
                  >
                    <div className="flex flex-col gap-5 sm:flex-row">
                      <div className="flex h-44 w-full shrink-0 items-center justify-center rounded-2xl bg-slate-950/80 p-4 sm:h-40 sm:w-40">
                        <img src={item.imagen} alt={item.nombre} className="h-full w-full object-contain" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{item.marca || "SportHub"}</p>
                            <h2 className="mt-1.5 text-xl font-bold leading-snug sm:text-2xl">{item.nombre}</h2>
                            <p className="mt-2 text-sm text-slate-400">{item.deporte || "Deporte"} • {item.categoria}</p>
                            {item.stock !== undefined && <p className="mt-1 text-xs text-slate-500">Stock: {item.stock} unidades</p>}

                            {pocasUnidades && (
                              <div className="mt-3">
                                <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${stockCompleto ? 'border-slate-700 bg-slate-800/70 text-slate-400' : 'border-amber-400/20 bg-amber-400/10 text-amber-300'}`}>
                                  {stockCompleto ? 'Stock máximo agregado' : `Solo quedan ${stockRestante}`}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex shrink-0 items-center">
                            <div className="flex items-center gap-0.5 rounded-lg border border-slate-700 bg-slate-950/80 p-0.5">
                              <button disabled={item.cantidad <= 1} onClick={() => cambiarCantidad(index, item.cantidad - 1)} aria-label="Reducir cantidad" className="flex h-7 w-7 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-25"><Minus size={13} /></button>
                              <span className="min-w-7 text-center text-xs font-bold" aria-label={`Cantidad: ${item.cantidad}`}>{item.cantidad}</span>
                              <button disabled={stockCompleto} onClick={() => cambiarCantidad(index, item.cantidad + 1)} aria-label="Aumentar cantidad" className="flex h-7 w-7 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-25"><Plus size={13} /></button>
                            </div>
                          </div>
                        </div>

                        <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
                          {tallas.length > 0 && (
                            <div>
                              <label className="mb-1.5 block text-xs font-medium text-slate-500">Talla</label>
                              <select value={item.tallaSeleccionada} onChange={(e) => cambiarTalla(index, e.target.value)} className={`rounded-xl border bg-slate-950 px-3 py-2 text-sm text-white outline-none transition focus:ring-2 ${item.tallaSeleccionada ? 'border-slate-700 focus:border-blue-500 focus:ring-blue-500/10' : 'border-red-500/60 focus:border-red-500 focus:ring-red-500/10'}`}>
                                <option value="">Seleccionar</option>
                                {tallas.map((talla) => <option key={talla}>{talla}</option>)}
                              </select>
                            </div>
                          )}
                          <div className="translate-y-2 text-right">
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Subtotal</p>
                            <p className="mt-1 text-3xl font-black leading-none text-emerald-400">${subtotal.toFixed(2)}</p>
                          </div>
                        </div>

                        {tallas.length > 0 && !item.tallaSeleccionada && <p className="mt-3 flex items-center gap-1.5 text-xs text-red-400"><AlertCircle size={14} /> Selecciona una talla para continuar.</p>}
                        <button onClick={() => eliminar(item, index)} className="mt-5 flex w-fit items-center gap-2 text-sm text-slate-500 transition hover:text-red-400"><Trash2 size={17} />Eliminar producto</button>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </div>

          <aside className="rounded-3xl border border-slate-700 bg-slate-900 p-8 lg:sticky lg:top-24">
            <h2 className="text-2xl font-bold">Resumen del pedido</h2>
            <div className="mt-8 space-y-5">
              <div className="flex justify-between"><span className="text-slate-400">Subtotal</span><span>${total.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Envío</span><span className="text-emerald-400">Gratis</span></div>
              <hr className="border-slate-700" />
              <div className="flex justify-between text-2xl font-black"><span>Total</span><span className="text-emerald-400">${total.toFixed(2)}</span></div>
            </div>

            <button disabled={faltanTallas} onClick={() => navigate(user ? "/pago" : "/iniciodesesión")} className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-4 text-lg font-semibold transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-500"><ShieldCheck size={20} />Proceder al pago</button>
            <button onClick={() => setConfirmarVaciado(true)} className="mt-4 w-full rounded-2xl border border-slate-700 py-3 text-slate-400 transition hover:border-red-500 hover:text-red-400">Vaciar carrito</button>
          </aside>
        </div>
      </div>

      <AnimatePresence>
        {confirmarVaciado && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm" onClick={() => setConfirmarVaciado(false)}>
            <motion.div initial={reducirMovimiento ? false : { opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} role="dialog" aria-modal="true" aria-labelledby="titulo-vaciar" onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
              <div className="flex items-start justify-between gap-4"><div><h2 id="titulo-vaciar" className="text-xl font-bold">¿Vaciar el carrito?</h2><p className="mt-2 text-sm leading-6 text-slate-400">Se eliminarán todos los productos agregados.</p></div><button onClick={() => setConfirmarVaciado(false)} aria-label="Cerrar" className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-800 hover:text-white"><X size={18} /></button></div>
              <div className="mt-6 grid grid-cols-2 gap-3"><button onClick={() => setConfirmarVaciado(false)} className="rounded-xl border border-slate-700 py-3 text-sm font-semibold text-slate-300 hover:bg-slate-800">Cancelar</button><button onClick={() => { vaciarCarrito(); setConfirmarVaciado(false); }} className="rounded-xl bg-red-500 py-3 text-sm font-semibold text-white hover:bg-red-600">Vaciar</button></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Carrito;
