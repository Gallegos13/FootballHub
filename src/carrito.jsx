import { ShoppingBag, Trash2, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./autentificación.jsx";

function Carrito({ cart, vaciarCarrito, quitarDelCarrito, cambiarTalla }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const total = cart.reduce((sum, item) => sum + Number(item.precio), 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 pt-24 px-6 text-white">
        <div className="mx-auto flex max-w-xl flex-col items-center rounded-3xl border border-slate-800 bg-slate-900 p-12 text-center">
          <ShoppingBag size={70} className="mb-6 text-emerald-400" />

          <h1 className="text-4xl font-black">
            Tu carrito está vacío
          </h1>

          <p className="mt-4 text-slate-400">
            Explora nuestro catálogo y encuentra el producto perfecto para ti.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-24 px-6 pb-10 text-white">

      <div className="mx-auto max-w-7xl">

        <div className="mb-10 flex items-center justify-between">

          <div>
            <h1 className="text-5xl font-black">
              Carrito
            </h1>

            <p className="mt-2 text-slate-400">
              {cart.length} artículo{cart.length !== 1 && "s"}
            </p>
          </div>

        </div>

        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">

          <div className="space-y-6">

            {cart.map((item, index) => (

              <div
                key={`${item.id}-${index}`}
                className="
                  rounded-3xl
                  border
                  border-slate-700
                  bg-slate-900
                  p-6
                  transition-all
                  duration-300
                  hover:border-blue-400/82
                "
              >

                <div className="flex flex-col gap-6 md:flex-row">

                  <div className="flex h-40 w-full items-center justify-center rounded-2xl bg-slate-950 md:w-44">

                    <img
                      src={item.imagen}
                      alt={item.nombre}
                      className="h-32 object-contain"
                    />

                  </div>

                  <div className="flex flex-1 flex-col justify-between">

                    <div>

                      <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                        {item.marca || "SportHub"}
                      </p>

                      <h2 className="mt-2 text-2xl font-bold">
                        {item.nombre}
                      </h2>

                      <p className="mt-2 text-slate-400">
                        {item.deporte} • {item.categoria}
                      </p>

                      {item.stock !== undefined && (
                        <p className="mt-1 text-xs text-slate-500">
                          Stock: {item.stock} unidades
                        </p>
                      )}

                    </div>

                    <div className="mt-6 flex flex-wrap items-center justify-between gap-4">

                      <select
                        value={item.tallaSeleccionada}
                        onChange={(e) =>
                          cambiarTalla(index, e.target.value)
                        }
                        className="
                          rounded-xl
                          border
                          border-slate-700
                          bg-slate-950
                          px-4
                          py-2
                          text-white
                          outline-none
                          focus:border-emerald-500
                        "
                      >
                        <option value="">Selecciona talla</option>

                        {item.tallas.split(",").map((talla) => (
                          <option key={talla}>
                            {talla}
                          </option>
                        ))}
                      </select>

                      <p className="text-3xl font-black text-emerald-400">
                        ${Number(item.precio).toFixed(2)}
                      </p>

                    </div>

                    <button
                      onClick={() => quitarDelCarrito(index)}
                      className="
                        mt-6
                        flex
                        w-fit
                        items-center
                        gap-2
                        text-slate-400
                        transition
                        hover:text-red-500
                      "
                    >
                      <Trash2 size={18} />

                      Eliminar
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

          <div
            className="
              h-fit
              rounded-3xl
              border
              border-slate-700
              bg-slate-900
              p-8
              lg:sticky
              lg:top-24
            "
          >

            <h2 className="text-2xl font-bold">
              Resumen del pedido
            </h2>

            <div className="mt-8 space-y-5">

              <div className="flex justify-between">
                <span className="text-slate-400">
                  Subtotal
                </span>

                <span>
                  ${total.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">
                  Envío
                </span>

                <span className="text-emerald-400">
                  Gratis
                </span>
              </div>

              <hr className="border-slate-700" />

              <div className="flex justify-between text-2xl font-black">
                <span>Total</span>

                <span className="text-emerald-400">
                  ${total.toFixed(2)}
                </span>
              </div>

            </div>

            <button
              onClick={() => {
                if (!user) {
                  navigate("/iniciodesesión");
                } else {
                  navigate("/pago");
                }
              }}
              className="
                mt-8
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-2xl
                bg-emerald-500
                py-4
                text-lg
                font-semibold
                transition
                hover:bg-emerald-600
              "
            >
              <ShieldCheck size={20} />

              Proceder al pago
            </button>

            <button
              onClick={vaciarCarrito}
              className="
                mt-4
                w-full
                rounded-2xl
                border
                border-slate-700
                py-3
                text-slate-400
                transition
                hover:border-red-500
                hover:text-red-500
              "
            >
              Vaciar carrito
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Carrito;
