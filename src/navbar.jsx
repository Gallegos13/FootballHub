import { Link } from "react-router-dom";
function Navbar() {
  return (
    <nav className="bg-slate-900 fixed w-full z-20 top-0 border-b border-slate-700">
      <div className="flex items-center justify-between mx-auto p-4">
        <a href="#" className="flex items-center space-x-3">
          <span className="self-center text-xl font-semibold text-white">
            FootballHub
          </span>
        </a>

        <ul className="flex space-x-8 text-white">
          <li>
            <Link to="/" className="hover:text-green-400">
              Inicio
            </Link>
          </li>

          <li>
            <Link to="/favoritos" className="hover:text-green-400">
              Favoritos
            </Link>
          </li>

          <li>
            <a href="#" className="hover:text-green-400">
              Jugadores
            </a>
          </li>

          
        </ul>

        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
          Menu
        </button>
      </div>
    </nav>
  );
}

export default Navbar;