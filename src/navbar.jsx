import { Link } from "react-router-dom";

function Navbar({ cartCount }) {
  return (
    <nav className="bg-slate-900 fixed w-full z-20 top-0 border-b border-slate-700">
      <div className="flex items-center justify-between mx-auto p-4">
        <a href="#" className="flex items-center space-x-3">
          <span className="self-center text-xl font-semibold text-white">
            FootballHub
          </span>
        </a>

        <ul className="flex gap-4 text-white text-sm">
          <li>
            <Link to="/" className="hover:text-green-400">
              Inicio
            </Link>
          </li>

          <li>
            <Link to="/carrito" className="hover:text-green-400 relative">
              Carrito
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-4 bg-green-600 text-white text-xs rounded-full px-1.5">
                  {cartCount}
                </span>
              )}
            </Link>
          </li>

          <li>
            <a href="#" className="hover:text-green-400">
              Ofertas
            </a>
          </li>
        </ul>

        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
          Categorías
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
