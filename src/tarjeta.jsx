
function Tarjeta({ team, favoritos, toggleFavorito }) {
    const esFavorito = favoritos.some(
    fav => fav.id === team.id
  )
  return (
    <div className="relative bg-slate-800 w-full p-6 rounded-xl shadow-lg border border-slate-700">
         <button
        onClick={() => toggleFavorito(team)}
        className={`absolute top-2 right-2 text-2xl  ${
          esFavorito
            ? "text-yellow-400"
            : "text-gray-500"
        }`}
      >
        ★
      </button>
      <div className="flex flex-col items-center">
        <img
          className="w-24 h-24 mb-6  object-contain"
          src={team.imagen}
          
        />

        <h5 className="mb-1 text-xl font-semibold text-white">
          {team.name}
        </h5>

        <span className="text-slate-400">
          {team.country}
        </span>

        <span className="text-green-400 mt-2">
          Posicion Actual: {team.posicion}
        </span>

        <div className="flex mt-5 gap-3">
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
            Informacion
          </button>

          <button className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg">
            Estadísticas
          </button>
        </div>
      </div>
    </div>
  );
}

export default Tarjeta;