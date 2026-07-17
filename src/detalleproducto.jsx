import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

function ProductoDetalle({ toggleCarrito }) {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [talla, setTalla] = useState("");
  const [errorDetalle, setErrorDetalle] = useState(null);

  useEffect(() => {
    fetch(`https://footballhub-vpka.onrender.com/productos/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Producto no encontrado')
        return res.json()
      })
      .then(data => setProducto(data))
      .catch(err => {
        console.error('Error al obtener producto:', err)
        setErrorDetalle('No se pudo cargar el producto. Intenta de nuevo más tarde.')
      });
  }, [id]);

  if (errorDetalle) {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-6 pt-20">
        <div className="max-w-6xl mx-auto">
          <p className="text-red-400 text-lg">{errorDetalle}</p>
          <a href="/" className="text-blue-400 hover:underline mt-4 inline-block">Volver al catálogo</a>
        </div>
      </div>
    );
  }

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

            <p className="mt-2 text-slate-300">
              Categoría: {producto.categoria}
            </p>

            <p className="mt-2 text-slate-300">
              Stock disponible: {producto.stock > 0 ? `${producto.stock} unidades` : 'Agotado'}
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