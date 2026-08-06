import { Link } from "react-router-dom";
import { ShoppingCart, ArrowRight, Tag, Heart } from "lucide-react";
import { useNavigate} from "react-router-dom";

function Tarjeta({ product, cart, toggleCarrito }) {
  const navigate = useNavigate();
  const enCarrito = cart
    ? cart.filter(item => item.id === product.id).reduce((total, item) => total + item.cantidad, 0)
    : 0
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
        border-slate-800
        bg-slate-900/80
        transition-all
        duration-300
        hover:-translate-y-1.5
        hover:border-blue-400
        hover:shadow-[0_0_40px_rgba(59,130,246,0.35)]
      "
    >
      <div className="relative flex h-60 items-center justify-center bg-gradient-to-br from-slate-950 to-slate-900">
        <button
          aria-label={`Agregar ${product.nombre} a favoritos`}
          onClick={(e) => e.stopPropagation()}
          className="
            absolute
            right-4
            top-4
            rounded-full
            border
            border-slate-700/80
            bg-slate-950/60
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

      <div className="flex min-h-[310px] flex-col p-5">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
            {product.marca || "SportHub"}
          </p>

          <h2 className="mt-2 line-clamp-2 min-h-[48px] text-lg font-bold leading-snug text-white">
            {product.nombre}
          </h2>

          <div className="mt-3 flex items-center gap-2 text-sm text-slate-400">
            <Tag size={15} />

            <span>
              {product.deporte || "Deporte"} • {product.categoria}
            </span>
          </div>

          <p className="mt-5 text-2xl font-black text-emerald-400">
            ${Number(product.precio).toFixed(2)}
          </p>
        </div>

        <div className="mt-auto border-t border-slate-800 pt-5">
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
