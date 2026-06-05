import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Navbar from './navbar'
import Tarjeta from './tarjeta'
import Equipos from './equipos';
import { Routes, Route } from 'react-router-dom'
import Favoritos from './equiposfavoritos'
 
function App() {
  const [favoritos, setFavoritos] = useState([])
  const [correo, setCorreo] = useState("")
const [suscrito, setSuscrito] = useState(false)
  const toggleFavorito = (equipo) => {

  const existe = favoritos.some(
    favorito => favorito.id === equipo.id
  )

  if (existe) {
    setFavoritos(
      favoritos.filter(
        favorito => favorito.id !== equipo.id
      )
    )
  } else {
    setFavoritos([...favoritos, equipo])
  }

}
const suscribirse = () => {

  if (correo.trim() === "") {
    return
  }

  setSuscrito(true)

}
  return (
    <Routes>
      <Route
      path='/'
      element={
        <>
      
    
      <Navbar />
<div className="min-h-screen bg-slate-900 text-white flex flex-col">
      

      <main className="max-w-6xl mx-auto p-6 flex-1">
        <h2 className="text-3xl font-bold mb-6">
          Equipos destacados
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 ">
          {Equipos.map((team) => (
            <Tarjeta
              key={team.id}
              team={team}
              favoritos={favoritos}
              toggleFavorito={toggleFavorito}
            />
          ))}
        </div>
      </main>
      <footer className="bg-slate-800 border-t border-slate-700 mt-10 py-4">

  <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-3">

    <div>
      <h3 className="font-bold text-lg">
        Newsletter Football Hub
      </h3>

      <p className="text-slate-400 text-sm">
        Recibe noticias y estadísticas semanales.
      </p>
    </div>

    {!suscrito ? (
      <div className="flex gap-2 w-full md:w-auto">
        <input
          type="email"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          placeholder="Tu correo"
          className="px-3 py-2 rounded-lg text-white"
        />

        <button
          onClick={suscribirse}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg"
        >
          Suscribirme
        </button>
      </div>
    ) : (
      <span className="text-green-400 font-semibold">
        Suscrito
      </span>
    )}

  </div>

</footer>
</div>
    </>
      }
/>
<Route
path="/favoritos"
element={
  <Favoritos favoritos={favoritos}/>

}
/>
</Routes>
)
}
export default App;
 
