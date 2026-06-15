import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

function ProductoDetalle({ toggleCarrito }) {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [talla, setTalla] = useState("");

  useEffect(() => {
    fetch(`https://footballhub-production.up.railway.app/productos/${id}`)
      .then(res => res.json())
      .then(data => setProducto(data));
  }, [id]);

  if (!producto) {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-6 pt-20">
        <p className="text-slate-400">Cargando...</p>
      </div>
    );
  }

  const handleToggleCarrito = () => {
    toggleCarrito({
      ...producto,
      tallaSeleccionada: talla
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 pt-20">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-10">

          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="w-full rounded-xl"
          />

          <div>
            <h1 className="text-4xl font-bold">
              {producto.nombre}
            </h1>

            <p className="text-slate-400 mt-3">
              {producto.descripcion}
            </p>

            <p className="text-3xl text-green-400 mt-5">
              ${Number(producto.precio).toFixed(2)}
            </p>

            <p className="mt-4">
              Marca: {producto.marca}
            </p>

            <div className="mt-6">
              <h3 className="font-bold mb-2">
                Selecciona tu talla
              </h3>

              <select
                value={talla}
                onChange={(e) => setTalla(e.target.value)}
                className="bg-slate-800 p-2 rounded text-white"
              >
                <option value="">
                  Seleccionar
                </option>

                {producto.tallas
                  .split(",")
                  .map((t) => (
                    <option key={t}>
                      {t}
                    </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleToggleCarrito}
              className="mt-6 px-6 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white"
            >
              Agregar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductoDetalle;