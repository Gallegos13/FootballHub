import { useNavigate } from "react-router-dom";
import { useAuth } from "./autentificación.jsx";
import { useEffect } from "react";
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
  const productName = `${cart.length} artículo${cart.length !== 1 ? "s" : ""} • SportHub`;

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
    <div className="min-h-screen bg-slate-950 pt-20">
      <Pasarela
        productName={productName}
        amount={total}
        currency="MXN"
        onSuccess={handleSuccess}
      />
    </div>
  );
}

export default Pago;