import Navbar from "./navbar"
import Tarjeta from "./tarjeta"
function Favoritos({ favoritos }) {
    
  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <h1 className="text-4xl font-bold mb-6">
        Equipos Favoritos
      </h1>

      {favoritos.length === 0 ? (
        <p>No hay equipos favoritos.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 ">
          {favoritos.map((team) => (
            <Tarjeta
              key={team.id}
              team={team}
              favoritos={favoritos}
            />
          ))}
        </div>
      )}
    </div>
    </>
  )
}

export default Favoritos