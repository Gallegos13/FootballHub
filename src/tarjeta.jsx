import { Link } from "react-router-dom";
import { ShoppingCart, ArrowRight, Tag, Heart } from "lucide-react";
import { useNavigate} from "react-router-dom";

function Tarjeta({ product, cart, toggleCarrito }) {
  const navigate = useNavigate();
  const enCarrito = cart ? cart.filter(item => item.id === product.id).length : 0
  const sinStock = product.stock !== undefined && enCarrito >= product.stock

  return (
    <div
    onClick={() => navigate(`/producto/${product.id}`)}
      className="
        group
        cursor-pointer
        overflow-hidden
        rounded-3xl
        border
        border-slate-700
        bg-slate-900
        transition-all
        duration-300
        hover:-translate-y-2
        hover:border-emerald-500/40
        hover:shadow-2xl
        hover:shadow-emerald-500/10
      "
    >
      <div className="relative flex h-64 items-center justify-center bg-gradient-to-br from-slate-950 to-slate-900">
        <button
          className="
            absolute
            right-4
            top-4
            rounded-full
            border
            border-slate-700
            bg-slate-800/70
            p-2
            text-slate-400
            backdrop-blur-sm
            transition
            hover:scale-110
            hover:text-red-500
          "
        >
          <Heart size={18} />
        </button>

        <img
          src={product.imagen}
          alt={product.nombre}
          className="
            h-52
            object-contain
            transition-transform
            duration-500
            group-hover:scale-110
          "
        />
      </div>

      <div className="space-y-5 p-6">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
            {product.marca || "SportHub"}
          </p>

          <h2 className="mt-2 min-h-[56px] text-xl font-bold leading-tight text-white">
            {product.nombre}
          </h2>

          <div className="mt-3 flex items-center gap-2 text-sm text-slate-400">
            <Tag size={15} />

            <span>
              {product.deporte || "Deporte"} • {product.categoria}
            </span>
          </div>

          <p className="mt-5 text-3xl font-black text-emerald-400">
            ${Number(product.precio).toFixed(2)}
          </p>
        </div>

        <div className="border-t border-slate-800 pt-5">
          <button
            disabled={sinStock}
            onClick={(e) => {
              e.stopPropagation();
              toggleCarrito(product);
            }}
            className={`
              flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-2xl
              py-3
              font-semibold
              text-white
              transition-all
              duration-300
              active:scale-95
              ${sinStock
                ? 'cursor-not-allowed bg-slate-700 text-slate-400'
                : 'bg-emerald-500 hover:scale-[1.02] hover:bg-emerald-600'
              }
            `}
          >
            <ShoppingCart size={18} />
            {sinStock ? 'Sin stock' : 'Agregar al carrito'}
          </button>

          <Link
            to={`/producto/${product.id}`}
            className="
              mt-4
              flex
              items-center
              justify-center
              gap-2
              text-sm
              font-medium
              text-slate-400
              transition
              hover:text-emerald-400
            "
          >
            Ver producto

            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Tarjeta;
