import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, House, Tag, Menu, X, User, ChevronDown, LogOut, ClipboardList } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "./autentificación.jsx";

function Navbar({ cartCount }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [dropdownAbierto, setDropdownAbierto] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownAbierto(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setDropdownAbierto(false);
    navigate("/");
  };

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

        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownAbierto(!dropdownAbierto)}
              className="flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 font-semibold text-white transition hover:bg-slate-700"
            >
              <User size={18} />
              <span className="max-w-28 truncate">{user.email}</span>
              <ChevronDown size={16} className={`transition-transform ${dropdownAbierto ? "rotate-180" : ""}`} />
            </button>

            {dropdownAbierto && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-800 border border-slate-700 shadow-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-700">
                  <p className="text-sm text-slate-400">Cuenta</p>
                  <p className="text-white font-medium truncate">{user.email}</p>
                </div>
                <button
                  onClick={() => { setDropdownAbierto(false); navigate("/mis-compras"); }}
                  className="flex items-center gap-3 w-full px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-white transition text-left"
                >
                  <ClipboardList size={18} />
                  Ver mis compras
                </button>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-3 w-full px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-white transition text-left border-t border-slate-700"
                >
                  <LogOut size={18} />
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/iniciodesesión"
            className="rounded-xl bg-blue-600 px-5 py-2 font-semibold text-white transition hover:bg-blue-500"
          >
            Iniciar sesión
          </Link>
        )}

        <button
          className="md:hidden text-slate-300 hover:text-white transition"
          onClick={() => setMenuAbierto(!menuAbierto)}
        >
          {menuAbierto ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {menuAbierto && (
        <div className="md:hidden border-t border-slate-700/50 bg-slate-950/95 backdrop-blur-lg">
          <ul className="flex flex-col items-center gap-4 py-4 text-slate-300 font-medium">
            <li>
              <Link
                to="/"
                className="flex items-center gap-2 hover:text-blue-400 transition"
                onClick={() => setMenuAbierto(false)}
              >
                <House size={18} />
                Inicio
              </Link>
            </li>
            <li className="relative">
              <Link
                to="/carrito"
                className="flex items-center gap-2 hover:text-blue-400 transition"
                onClick={() => setMenuAbierto(false)}
              >
                <ShoppingCart size={18} />
                Carrito
                {cartCount > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
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
            {user ? (
              <>
                <li className="w-full px-6 border-t border-slate-700 pt-3">
                  <p className="text-sm text-slate-400 mb-2">{user.email}</p>
                </li>
                <li>
                  <button
                    onClick={() => { setMenuAbierto(false); navigate("/mis-compras"); }}
                    className="flex items-center gap-2 hover:text-blue-400 transition"
                  >
                    <ClipboardList size={18} />
                    Ver mis compras
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { handleSignOut(); setMenuAbierto(false); }}
                    className="flex items-center gap-2 hover:text-red-400 transition"
                  >
                    <LogOut size={18} />
                    Cerrar sesión
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link
                  to="/iniciodesesión"
                  className="flex items-center gap-2 hover:text-blue-400 transition"
                  onClick={() => setMenuAbierto(false)}
                >
                  <User size={18} />
                  Iniciar sesión
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </motion.nav>
  );
}

export default Navbar;
