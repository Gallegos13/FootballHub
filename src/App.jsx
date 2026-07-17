import { useState, useEffect } from 'react'
import './App.css'
import Navbar from './navbar'
import Tarjeta from './tarjeta'
import { Routes, Route } from 'react-router-dom'
import Carrito from './carrito'
import ProductoDetalle from './detalleproducto'
import Portada from './Portada'

function App() {
  const [productos, setProductos] = useState([])
  const [cart, setCart] = useState([])
  const [correo, setCorreo] = useState("")
  const [suscrito, setSuscrito] = useState(false)
  const [cargando, setCargando] = useState(true)
  const [errorCatalogo, setErrorCatalogo] = useState(null)
  const [busqueda, setBusqueda] = useState("")
const [categoria, setCategoria] = useState("")
const [deporte, setDeporte] = useState("")
const [marca, setMarca] = useState("")

  useEffect(() => {
    fetch('https://footballhub-vpka.onrender.com/productos')
      .then(res => {
        if (!res.ok) throw new Error('Error al cargar productos')
        return res.json()
      })
      .then(data => setProductos(data))
      .catch(err => {
        console.error('Error al obtener productos:', err)
        setErrorCatalogo('No se pudieron cargar los productos. Intenta de nuevo más tarde.')
      })
      .finally(() => setCargando(false))
  }, [])
const categorias = [...new Set(productos.map(p => p.categoria).filter(Boolean))]
const deportes = [...new Set(productos.map(p => p.deporte).filter(Boolean))]
const marcas = [...new Set(productos.map(p => p.marca).filter(Boolean))]
  const toggleCarrito = (product) => {
    setCart([
      ...cart,
      {
        ...product,
        tallaSeleccionada: product.tallaSeleccionada || ""
      }
    ])
  }

  const quitarDelCarrito = (index) => {
    setCart(cart.filter((_, i) => i !== index))
  }

  const cambiarTalla = (index, talla) => {
    setCart(
      cart.map((item, i) =>
        i === index
          ? { ...item, tallaSeleccionada: talla }
          : item
      )
    )
  }

  const vaciarCarrito = () => {
    setCart([])
  }

  const suscribirse = () => {
    if (correo.trim() === "") {
      return
    }
    const newLocal = true
    setSuscrito(newLocal)
  }
const productosFiltrados = productos.filter(producto => {
  return (
    producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) &&
    (categoria === "" || producto.categoria === categoria) &&
    (deporte === "" || producto.deporte === deporte) &&
    (marca === "" || producto.marca === marca)
  )
})
  return (
    <Routes>
      <Route
        path='/'
        element={
          <>
            <Navbar cartCount={cart.length} />
            <div className="min-h-screen bg-slate-900 text-white flex flex-col">
              <main className="relative overflow-hidden pt-24">

    <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-green-500/10 blur-3xl"></div>

    <div className="absolute top-96 right-0 w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-3xl pointer-events-none"></div>

    <div className="relative max-w-7xl mx-auto px-6">
                <Portada />
                <h2 className="text-4xl font-extrabold mb-8">
                  Productos destacados
                </h2> 
                </div>
<div className="mb-10 space-y-5">

  <div className="relative mb-4">
    <input
      type="text"
      placeholder="🔍 Buscar productos..."
      value={busqueda}
      onChange={(e)=>setBusqueda(e.target.value)}
      className="w-full rounded-xl bg-slate-900 border border-slate-700 px-5 py-3 text-white placeholder-slate-400 focus:border-green-500 focus:ring-2 focus:ring-green-500 outline-none transition"
    />
  </div>

  <div className="flex flex-wrap justify-end items-center gap-3">

    <select
      value={categoria}
      onChange={(e)=>setCategoria(e.target.value)}
      className="rounded-xl bg-slate-900 border border-slate-700 px-4 py-3 text-white focus:border-green-500 focus:ring-2 focus:ring-green-500 outline-none"
    >
      <option value="">📂 Categoría</option>
      {categorias.map(cat=>(
        <option key={cat}>{cat}</option>
      ))}
    </select>

    <select
      value={deporte}
      onChange={(e)=>setDeporte(e.target.value)}
      className="rounded-xl bg-slate-900 border border-slate-700 px-4 py-3 text-white focus:border-green-500 focus:ring-2 focus:ring-green-500 outline-none"
    >
      <option value="">⚽ Deporte</option>
      {deportes.map(dep=>(
        <option key={dep}>{dep}</option>
      ))}
    </select>

    <select
      value={marca}
      onChange={(e)=>setMarca(e.target.value)}
      className="rounded-xl bg-slate-900 border border-slate-700 px-4 py-3 text-white focus:border-green-500 focus:ring-2 focus:ring-green-500 outline-none"
    >
      <option value="">🏷️ Marca</option>
      {marcas.map(mar=>(
        <option key={mar}>{mar}</option>
      ))}
    </select>

    <button
      onClick={()=>{
        console.log("Limpiar");
        setBusqueda("")
        setCategoria("")
        setDeporte("")
        setMarca("")
      }}
     className="text-slate-400 hover:text-white transition"
    >
      Limpiar
    </button>

  </div>

</div>
               <div className="mx-auto max-w-6xl">
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">

                  {cargando ? (
      <p className="col-span-full text-center text-slate-400 text-lg py-10">
        Cargando productos...
      </p>
                  ) : errorCatalogo ? (
      <p className="col-span-full text-center text-red-400 text-lg py-10">
        {errorCatalogo}
      </p>
    ) : productosFiltrados.length === 0 ? (
      <p className="col-span-full text-center text-slate-400 text-lg py-10">
        No se encontraron productos.
      </p>
                  ) : (
                    productosFiltrados.map((product) => (
                      <Tarjeta
                        key={product.id}
                        product={product}
                        toggleCarrito={toggleCarrito}
                      />
                    ))
                  )}

  </div>
                </div>
              </main>

              <footer className="bg-slate-800 border-t border-slate-700 mt-10 py-4">
                <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-lg">
                      Promociones Exclusivas
                    </h3>
                    <p className="text-slate-400 text-sm">
                      Recibe ofertas y novedades semanales.
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
        path="/carrito"
        element={
          <>
            <Navbar cartCount={cart.length} />
            <Carrito cart={cart} vaciarCarrito={vaciarCarrito} quitarDelCarrito={quitarDelCarrito} cambiarTalla={cambiarTalla} />
          </>
          
        }
      />
      <Route
      path="/producto/:id"
      element={
        <>
          <Navbar cartCount={cart.length} />
          <ProductoDetalle toggleCarrito={toggleCarrito} />
        </>
      } />
    </Routes>
  )
}

export default App;
