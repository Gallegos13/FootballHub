import { Link } from "react-router-dom";
function Tarjeta({ product, toggleCarrito}) {
  return (
    <div className="relative bg-slate-800 w-full p-6 rounded-xl shadow-lg border border-slate-700">
      <div className="flex flex-col items-center">
        <img
          className="w-24 h-24 mb-6 object-contain"
          src={product.imagen}
          alt={product.nombre}
        />

        <h5 className="mb-1 text-xl font-semibold text-white">
          {product.nombre}
        </h5>

        <span className="text-slate-400">
          {product.categoria}
        </span>

        <span className="text-green-400 mt-2">
          ${Number(product.precio).toFixed(2)}
        </span>

        <div className="flex mt-5 gap-3">
          <button
            onClick={() => toggleCarrito(product)}
            className="px-4 py-2 rounded-lg text-white bg-green-600 hover:bg-green-700"
          >
            Agregar
          </button>

          <Link to={`/producto/${product.id}`}
          className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg">
            Detalles
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Tarjeta;
