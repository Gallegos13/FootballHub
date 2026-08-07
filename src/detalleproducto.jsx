import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { AlertCircle, ArrowLeft, Check, Heart, Package, ShieldCheck, ShoppingCart, Tag, Truck, X, ZoomIn } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { obtenerImagenProducto } from "./imagenproducto.js";

function ProductoDetalle({ toggleCarrito, cart }) {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [talla, setTalla] = useState("");
  const [errorTalla, setErrorTalla] = useState(false);
  const [agregado, setAgregado] = useState(false);
  const [zoomAbierto, setZoomAbierto] = useState(false);
  const [favorito, setFavorito] = useState(false);
  const [errorDetalle, setErrorDetalle] = useState(null);
  const reducirMovimiento = useReducedMotion();

  useEffect(() => {
    fetch(`https://footballhub-vpka.onrender.com/productos/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Producto no encontrado')
        return res.json()
      })
      .then(data => setProducto({
        ...data,
        imagen: obtenerImagenProducto(data),
      }))
      .catch(err => {
        console.error('Error al obtener producto:', err)
        setErrorDetalle('No se pudo cargar el producto. Intenta de nuevo más tarde.')
      });
  }, [id]);

  useEffect(() => {
    if (!agregado) return;
    const temporizador = setTimeout(() => setAgregado(false), 1800);
    return () => clearTimeout(temporizador);
  }, [agregado]);

  useEffect(() => {
    if (!zoomAbierto) return;
    const cerrarConEscape = (event) => {
      if (event.key === "Escape") setZoomAbierto(false);
    };
    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", cerrarConEscape);
    return () => {
      document.body.style.overflow = overflowAnterior;
      document.removeEventListener("keydown", cerrarConEscape);
    };
  }, [zoomAbierto]);

  if (errorDetalle) {
    return (
      <div className="min-h-screen bg-slate-950 px-6 pt-32 text-white">
        <div className="mx-auto max-w-xl rounded-3xl border border-red-500/20 bg-slate-900 p-10 text-center">
          <Package size={48} className="mx-auto text-red-400" />
          <h1 className="mt-5 text-2xl font-bold">No pudimos mostrar el producto</h1>
          <p className="mt-3 text-slate-400">{errorDetalle}</p>
          <Link to="/" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold transition hover:bg-blue-500">
            <ArrowLeft size={18} /> Volver al catálogo
          </Link>
        </div>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="min-h-screen bg-slate-950 px-6 pt-32 text-white">
        <div className="mx-auto grid max-w-6xl animate-pulse gap-10 md:grid-cols-2">
          <div className="aspect-square rounded-[2rem] bg-slate-900" />
          <div className="space-y-5 py-8">
            <div className="h-4 w-28 rounded bg-slate-800" />
            <div className="h-12 w-4/5 rounded bg-slate-800" />
            <div className="h-20 rounded bg-slate-900" />
            <div className="h-10 w-36 rounded bg-slate-800" />
          </div>
        </div>
      </div>
    );
  }

  const handleToggleCarrito = () => {
    if (tallas.length > 0 && !talla) {
      setErrorTalla(true);
      return;
    }
    setErrorTalla(false);
    toggleCarrito({
      ...producto,
      tallaSeleccionada: talla
    });
    setAgregado(true);
  };

  const enCarrito = cart
    ? cart.filter(item => item.id === Number(id)).reduce((total, item) => total + item.cantidad, 0)
    : 0
  const sinStock = producto.stock !== undefined && enCarrito >= producto.stock

  const tallas = producto.tallas ? producto.tallas.split(",").map(t => t.trim()) : [];

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 pb-16 pt-24 text-white">
      <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-96 h-96 w-96 rounded-full bg-indigo-500/5 blur-3xl" />

      <div className="relative mx-auto w-full max-w-[1360px] px-4 sm:px-8 lg:px-10 xl:px-12">
        <Link to="/#catalogo" className="mb-5 mt-3 inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-blue-400">
          <ArrowLeft size={17} /> Volver al catálogo
        </Link>

        <div className="cuadricula-detalle-producto grid min-h-[calc(100svh-9rem)] w-full items-center gap-8 md:grid-cols-2 lg:gap-10 xl:gap-12">
          <motion.div
            initial={reducirMovimiento ? false : { opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="relative flex min-h-[420px] items-center justify-center p-6 sm:min-h-[520px] sm:p-10 md:h-[calc(100svh-12rem)] md:max-h-[720px] md:p-12 lg:p-16"
          >
            <div className="absolute inset-[12%] rounded-full bg-blue-600/12 blur-3xl" />
            <div className="absolute left-[12%] top-[12%] h-28 w-28 rounded-full border border-blue-500/10 bg-blue-500/5 blur-xl" />
            <div className="absolute bottom-[10%] right-[10%] h-36 w-36 rounded-full bg-indigo-600/10 blur-2xl" />
            <div className="absolute bottom-[12%] left-1/2 h-8 w-[52%] -translate-x-1/2 rounded-full bg-black/50 blur-xl" />
            <span className="absolute left-2 top-3 rounded-full border border-slate-800 bg-slate-950/60 px-3 py-1.5 text-xs font-medium text-slate-400 backdrop-blur sm:left-6 sm:top-6">
              {producto.categoria || "Deporte"}
            </span>
            <button
              type="button"
              onClick={() => setZoomAbierto(true)}
              className="group relative flex h-full w-full cursor-zoom-in items-center justify-center"
              aria-label={`Ampliar imagen de ${producto.nombre}`}
            >
              <img
                src={producto.imagen}
                alt={producto.nombre}
                className="relative h-full max-h-[580px] w-full object-contain drop-shadow-[0_30px_45px_rgba(0,0,0,0.4)] transition duration-700 group-hover:scale-[1.03]"
              />
              <span className="absolute bottom-3 right-3 flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-950/75 px-3 py-2 text-xs font-semibold text-slate-300 opacity-0 shadow-lg backdrop-blur transition group-hover:opacity-100 group-focus-visible:opacity-100 sm:bottom-6 sm:right-6">
                <ZoomIn size={16} /> Ampliar
              </span>
            </button>
            <button
              type="button"
              onClick={() => setFavorito(!favorito)}
              aria-label={favorito ? "Quitar de favoritos" : "Agregar a favoritos"}
              aria-pressed={favorito}
              className={`absolute right-2 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border backdrop-blur transition sm:right-6 sm:top-6 ${favorito ? 'border-red-400/40 bg-red-500/15 text-red-400' : 'border-slate-700 bg-slate-950/60 text-slate-400 hover:border-red-400/40 hover:text-red-400'}`}
            >
              <Heart size={18} fill={favorito ? "currentColor" : "none"} />
            </button>
          </motion.div>

          <motion.div
            initial={reducirMovimiento ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: reducirMovimiento ? 0 : 0.12, ease: "easeOut" }}
            className="informacion-detalle-producto mx-auto flex w-full max-w-[400px] flex-col pb-8 md:py-10 lg:py-14"
          >
            <div className="flex flex-wrap items-center gap-2 text-[13px] font-bold uppercase tracking-[0.2em] text-blue-400">
              <Tag size={15} /> {producto.marca || "SportHub"}
              {producto.deporte && <><span className="text-slate-700">•</span><span className="text-slate-500">{producto.deporte}</span></>}
            </div>

            <h1 className="mt-4 text-3xl font-black leading-[1.12] tracking-[-0.04em] sm:text-4xl lg:text-[2.55rem]">
              {producto.nombre}
            </h1>

            <p className="mt-5 max-w-[390px] text-base leading-7 text-slate-400">
              {producto.descripcion}
            </p>

            <div className="mt-7 flex flex-col items-start gap-3">
              <p className="text-[2.6rem] font-black leading-none text-emerald-400">
                ${Number(producto.precio).toFixed(2)}
              </p>
              <div className="flex items-center gap-2 text-sm">
                <span className={`h-2.5 w-2.5 rounded-full ${producto.stock > 0 ? 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.7)]' : 'bg-red-400'}`} />
                <span className={producto.stock > 0 ? 'text-slate-300' : 'text-red-400'}>
                  {producto.stock > 0 ? `${producto.stock} disponibles` : 'Producto agotado'}
                </span>
              </div>
            </div>

            {tallas.length > 0 && (
              <div className={`mt-7 border-t pt-6 transition-colors ${errorTalla ? 'border-red-500/50' : 'border-slate-800'}`}>
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="font-bold">Selecciona tu talla</h2>
                  {talla
                    ? <span className="flex items-center gap-1 text-xs text-blue-400"><Check size={14} /> Talla {talla}</span>
                    : <span className="rounded-full border border-slate-700 bg-slate-900 px-2.5 py-1 text-[11px] font-semibold text-slate-400">Obligatoria</span>
                  }
                </div>
                {errorTalla && (
                  <p className="mb-3 flex items-center gap-2 text-sm text-red-400" role="alert">
                    <AlertCircle size={16} /> Elige una talla para continuar
                  </p>
                )}
                <div className="flex flex-wrap gap-2">
                  {tallas.map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => { setTalla(t); setErrorTalla(false); }}
                      className={`min-w-12 rounded-xl border px-4 py-2.5 text-sm font-semibold transition duration-200 active:scale-95 ${
                        talla === t
                          ? 'border-indigo-500 bg-indigo-700 text-white shadow-lg shadow-indigo-700/20'
                          : 'border-slate-700 bg-slate-950/60 text-slate-300 hover:-translate-y-0.5 hover:border-blue-500 hover:text-white'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="sticky bottom-0 z-20 -mx-4 mt-7 border-t border-slate-800/70 bg-slate-950/90 px-4 py-3 backdrop-blur md:static md:mx-0 md:border-0 md:bg-transparent md:p-0">
              <button
                disabled={sinStock}
                onClick={handleToggleCarrito}
                className={`flex w-full items-center justify-center gap-2 rounded-2xl px-8 py-4 text-base font-bold text-white transition active:scale-[0.98] ${
                  sinStock
                    ? 'cursor-not-allowed bg-slate-800 text-slate-500'
                    : 'bg-emerald-500 shadow-md shadow-black/10 hover:-translate-y-0.5 hover:bg-emerald-600 hover:shadow-lg hover:shadow-black/20'
                }`}
              >
                <motion.span
                  key={agregado ? "agregado" : "carrito"}
                  initial={reducirMovimiento ? false : { scale: 0.65, rotate: -12 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.22 }}
                >
                  {agregado && !sinStock ? <Check size={20} /> : <ShoppingCart size={20} />}
                </motion.span>
                <span aria-live="polite">
                  {sinStock ? 'Sin stock' : agregado ? 'Agregado al carrito' : 'Agregar al carrito'}
                </span>
              </button>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-800 pt-5 text-xs text-slate-400">
              <div className="flex items-center gap-2"><ShieldCheck size={17} className="text-blue-400" /> Compra segura</div>
              <div className="flex items-center gap-2"><Truck size={17} className="text-blue-400" /> Envío gratis</div>
            </div>
          </motion.div>
        </div>
      </div>

      {zoomAbierto && (
        <div
          className="fixed inset-0 z-[100] flex cursor-zoom-out items-center justify-center bg-slate-950/95 p-4 backdrop-blur-md sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={`Imagen ampliada de ${producto.nombre}`}
          onClick={() => setZoomAbierto(false)}
        >
          <button
            type="button"
            onClick={() => setZoomAbierto(false)}
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-slate-700 bg-slate-900/90 text-slate-300 transition hover:border-blue-500 hover:text-white sm:right-8 sm:top-8"
            aria-label="Cerrar imagen ampliada"
          >
            <X size={22} />
          </button>
          <img
            src={producto.imagen}
            alt={producto.nombre}
            onClick={(event) => event.stopPropagation()}
            className="max-h-[88vh] max-w-[92vw] cursor-default object-contain drop-shadow-[0_35px_70px_rgba(0,0,0,0.55)]"
          />
        </div>
      )}
    </div>
  );
}

export default ProductoDetalle;
