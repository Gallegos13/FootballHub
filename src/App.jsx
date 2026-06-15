import { useState, useEffect } from 'react'
import './App.css'
import Navbar from './navbar'
import Tarjeta from './tarjeta'
import { Routes, Route } from 'react-router-dom'
import Carrito from './equiposfavoritos'
import ProductoDetalle from './detalleproducto'

function App() {
  const [productos, setProductos] = useState([])
  const [cart, setCart] = useState([])
  const [correo, setCorreo] = useState("")
  const [suscrito, setSuscrito] = useState(false)

  useEffect(() => {
    fetch('https://footballhub-production.up.railway.app/productos')
      .then(res => res.json())
      .then(data => setProductos(data))
      .catch(err => console.error('Error al obtener productos:', err))
  }, [])

  const toggleCarrito = (product) => {
    setCart([
      ...cart,
      {
        ...product,
        tallaSeleccionada: ""
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
    setSuscrito(true)
  }

  return (
    <Routes>
      <Route
        path='/'
        element={
          <>
            <Navbar cartCount={cart.length} />
            <div className="min-h-screen bg-slate-900 text-white flex flex-col">
              <main className="max-w-6xl mx-auto p-6 flex-1 pt-20">
                <h2 className="text-3xl font-bold mb-6">
                  Productos destacados
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {productos.map((product) => (
                    <Tarjeta
                      key={product.id}
                      product={product}
                      cart={cart}
                      toggleCarrito={toggleCarrito}
                    />
                  ))}
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
          <ProductoDetalle cart={cart} toggleCarrito={toggleCarrito} />
        </>
      } />
    </Routes>
  )
}

export default App;
