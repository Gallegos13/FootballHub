import { Link } from "react-router-dom";
import { ShoppingCart, House, Tag, Trophy } from "lucide-react";
import { motion } from "framer-motion";

function Navbar({ cartCount }) {
  return (
    <motion.nav
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 w-full z-50 border-b border-slate-700/50 bg-slate-950/80 backdrop-blur-lg"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link
          to="/"
          className="flex items-center gap-2 text-white text-2xl font-bold"
        >
          
          <span>SportHub</span>
        </Link>

        <ul className="hidden md:flex items-center gap-8 text-slate-300 font-medium">
          <li>
            <Link
              to="/"
              className="flex items-center gap-2 hover:text-blue-400 transition"
            >
              <House size={18} />
              Inicio
            </Link>
          </li>

          <li className="relative">
            <Link
              to="/carrito"
              className="flex items-center gap-2 hover:text-blue-400 transition"
            >
              <ShoppingCart size={18} />
              Carrito

              {cartCount > 0 && (
                <span className="absolute -top-2 -right-4 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
                  {cartCount}
                </span>
              )}
            </Link>
          </li>

          <li>
            <button className="flex items-center gap-2 hover:text-blue-400 transition">
              <Tag size={18} />
              Ofertas
            </button>
          </li>
        </ul>

        <button className="rounded-xl bg-blue-600 px-5 py-2 font-semibold text-white transition hover:bg-blue-500">
          Categorías
        </button>
      </div>
    </motion.nav>
  );
}

export default Navbar;
