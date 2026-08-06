import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, House, Tag, Menu, X, User, ChevronDown, LogOut, ClipboardList, Trophy } from "lucide-react";
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
      className="fixed top-0 left-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/85 shadow-lg shadow-black/5 backdrop-blur-xl"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between md:grid md:grid-cols-3 px-6 py-4">
        <Link
          to="/"
          className="flex items-center gap-2.5 text-xl font-black tracking-tight text-white"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg shadow-blue-600/20"><Trophy size={19} /></span>
          <span>Sport<span className="text-[#4f7cff]">Hub</span></span>
        </Link>

        <ul className="hidden md:flex justify-center gap-8 text-slate-300 font-medium">
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
            <a href="/#catalogo" className="flex items-center gap-2 hover:text-blue-400 transition">
              <Tag size={18} />
              Ofertas
            </a>
          </li>
        </ul>

        <div className="flex items-center justify-end gap-4">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownAbierto(!dropdownAbierto)}
                className="flex items-center gap-3 rounded-xl border border-slate-700/50 bg-slate-800/80 px-3 py-1.5 font-semibold text-white transition-all duration-300 hover:border-blue-400/50 hover:bg-slate-800"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 text-xs font-bold text-white shadow-sm">
                  {user.email.charAt(0).toUpperCase()}
                </div>
                <span className="hidden md:block max-w-36 truncate text-sm">{user.email}</span>
                <ChevronDown size={14} className={`hidden md:block text-slate-400 transition-transform ${dropdownAbierto ? "rotate-180" : ""}`} />
              </button>

              {dropdownAbierto && (
                <div className="absolute right-0 mt-3 w-56 rounded-xl border border-slate-700/50 bg-slate-800/95 shadow-2xl shadow-blue-500/5 backdrop-blur-xl overflow-hidden">
                  <div className="px-4 py-4 border-b border-slate-700/50">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-sm font-bold text-white shadow-md">
                        {user.email.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-slate-400">Cuenta</p>
                        <p className="text-sm font-semibold text-white truncate">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => { setDropdownAbierto(false); navigate("/mis-compras"); }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-slate-300 hover:bg-blue-600/20 hover:text-blue-400 transition-all duration-200 text-left"
                  >
                    <ClipboardList size={18} />
                    Ver mis compras
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 w-full px-4 py-3 text-slate-300 hover:bg-red-600/20 hover:text-red-400 transition-all duration-200 text-left border-t border-slate-700/50"
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
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/15 transition hover:bg-blue-500"
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
              <a href="/#catalogo" className="flex items-center gap-2 hover:text-blue-400 transition" onClick={() => setMenuAbierto(false)}>
                <Tag size={18} />
                Ofertas
              </a>
            </li>
            {user ? (
              <>
                <li className="flex justify-center w-full px-6 -mt-1">
                  <div className="flex items-center gap-3 rounded-xl bg-slate-800/50 px-4 py-2.5 w-full max-w-xs">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 text-xs font-bold text-white shadow-sm">
                      {user.email.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-slate-400">Cuenta</p>
                      <p className="text-sm text-white font-medium truncate">{user.email}</p>
                    </div>
                  </div>
                </li>
                <li>
                  <button
                    onClick={() => { setMenuAbierto(false); navigate("/mis-compras"); }}
                    className="flex items-center gap-3 hover:text-blue-400 transition"
                  >
                    <ClipboardList size={18} />
                    Ver mis compras
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { handleSignOut(); setMenuAbierto(false); }}
                    className="flex items-center gap-3 hover:text-red-400 transition"
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
