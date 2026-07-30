import { useNavigate } from "react-router-dom";
import { useAuth } from "./autentificación.jsx";
import { useEffect } from "react";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import Pasarela from "./pasarela.jsx";
import { guardarCompra } from "./comprasstore.js";

function Pago({ cart, vaciarCarrito }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/iniciodesesión");
  }, [user, navigate]);

  if (!user || cart.length === 0) return null;

  const total = cart.reduce((sum, item) => sum + Number(item.precio), 0);
  const productName = `${cart.length} artículo${cart.length !== 1 ? "s" : ""}`;

  const contarItems = () => {
    const mapa = {};
    cart.forEach((item) => {
      mapa[item.id] = (mapa[item.id] || 0) + 1;
    });
    return Object.entries(mapa).map(([id, cantidad]) => ({ id: Number(id), cantidad }));
  };

  const handleSuccess = async (tx) => {
    try {
      const res = await fetch("https://footballhub-vpka.onrender.com/actualizar-stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: contarItems() }),
      });

      if (!res.ok && res.status !== 404) {
        console.warn("Error al actualizar stock:", await res.text());
      }
    } catch (err) {
      console.warn("Error de conexión al actualizar stock:", err);
    }

    guardarCompra(user.email, {
      id: tx.id,
      total: total.toFixed(2),
      articulos: cart.map((item) => ({
        nombre: item.nombre,
        precio: item.precio,
        talla: item.tallaSeleccionada,
        imagen: item.imagen,
      })),
      fecha: tx.date.toISOString(),
      ultimos4: tx.last4,
      marca: tx.brand,
    });
    vaciarCarrito();
    navigate("/mis-compras");
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-24 px-6 pb-10 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 sm:mb-8 flex items-start sm:items-center gap-3 sm:gap-4">
          <button
            onClick={() => navigate("/carrito")}
            className="mt-1 sm:mt-0 flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-all duration-300"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black">Pago</h1>
            <p className="mt-1 sm:mt-2 text-sm sm:text-base text-slate-400">Completa los datos de tu tarjeta para finalizar la compra</p>
          </div>
        </div>

        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-3xl border border-slate-700 bg-slate-900 p-4 sm:p-5 transition-all duration-300 hover:border-blue-400/82">
          <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-blue-500/10 shrink-0">
            <ShoppingBag size={22} className="text-blue-400" />
          </div>
          <div className="flex-1 min-w-0 w-full sm:w-auto">
            <p className="font-semibold text-sm sm:text-base">{productName}</p>
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-1.5">
              {cart.slice(0, 3).map((item, i) => (
                <span key={i} className="rounded-full bg-slate-800 px-2.5 sm:px-3 py-0.5 text-xs text-slate-400 truncate max-w-32">
                  {item.nombre}
                </span>
              ))}
              {cart.length > 3 && (
                <span className="rounded-full bg-slate-800 px-2.5 sm:px-3 py-0.5 text-xs text-slate-400">
                  +{cart.length - 3} más
                </span>
              )}
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-[#3072f0] whitespace-nowrap self-end sm:self-center">${total.toFixed(2)} MXN</p>
        </div>

        <Pasarela
          productName={productName}
          amount={total}
          currency="MXN"
          onSuccess={handleSuccess}
        />
      </div>
    </div>
  );
}

export default Pago;