import { useState, useEffect, useRef } from 'react'
import { Toaster, toast } from 'sonner'
import './App.css'
import Navbar from './navbar'
import Tarjeta from './tarjeta'
import { Routes, Route } from 'react-router-dom'
import Carrito from './carrito'
import ProductoDetalle from './detalleproducto'
import Portada from './Portada'
import Iniciosesión from './iniciodesesión'
import Registro from './registro'
import MisCompras from './miscompras'
import Pago from './pago'
import { Search, X, Mail, ArrowRight, ChevronDown, Check } from 'lucide-react'

function FilterSelect({ value, onChange, placeholder, options, className = '' }) {
  const [abierto, setAbierto] = useState(false)
  const contenedorRef = useRef(null)

  useEffect(() => {
    const cerrar = (event) => {
      if (contenedorRef.current && !contenedorRef.current.contains(event.target)) {
        setAbierto(false)
      }
    }
    document.addEventListener('mousedown', cerrar)
    return () => document.removeEventListener('mousedown', cerrar)
  }, [])

  return (
    <div ref={contenedorRef} className={`relative min-w-32 ${className}`}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={abierto}
        onClick={() => setAbierto(!abierto)}
        className={`flex w-full items-center justify-between gap-3 rounded-xl border bg-slate-900/60 px-3 py-3 text-left text-sm outline-none transition ${
          abierto ? 'border-blue-500 text-white ring-2 ring-blue-500/10' : 'border-slate-800 text-slate-300 hover:border-slate-700'
        }`}
      >
        <span className="truncate">{value || placeholder}</span>
        <ChevronDown size={15} className={`shrink-0 text-slate-500 transition-transform ${abierto ? 'rotate-180' : ''}`} />
      </button>

      {abierto && (
        <div role="listbox" className="absolute right-0 z-30 mt-2 max-h-60 min-w-full overflow-auto rounded-xl border border-slate-800 bg-slate-900 p-1.5 shadow-2xl shadow-black/40">
          <button
            type="button"
            role="option"
            aria-selected={value === ''}
            onClick={() => { onChange(''); setAbierto(false) }}
            className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm text-slate-400 transition hover:bg-indigo-800 hover:text-white"
          >
            {placeholder}
            {value === '' && <Check size={14} className="text-indigo-300" />}
          </button>
          {options.map((option) => (
            <button
              type="button"
              role="option"
              aria-selected={value === option}
              key={option}
              onClick={() => { onChange(option); setAbierto(false) }}
              className={`flex w-full items-center justify-between gap-3 whitespace-nowrap rounded-lg px-3 py-2 text-left text-sm transition ${value === option ? 'bg-indigo-700 text-white' : 'text-slate-300 hover:bg-indigo-800 hover:text-white'}`}
            >
              {option}
              {value === option && <Check size={14} className="text-indigo-300" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
function App() {
  const [productos, setProductos] = useState([])
  const [cart, setCart] = useState(() => {
    try {
      const guardado = JSON.parse(localStorage.getItem('sporthub-carrito') || '[]')
      return Array.isArray(guardado)
        ? guardado.map((item, index) => ({
            ...item,
            cantidad: Math.max(1, Number(item.cantidad) || 1),
            agregadoEn: item.agregadoEn || Date.now() + index
          }))
        : []
    } catch {
      return []
    }
  })
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

  useEffect(() => {
    localStorage.setItem('sporthub-carrito', JSON.stringify(cart))
  }, [cart])
const categorias = [...new Set(productos.map(p => p.categoria).filter(Boolean))]
const deportes = [...new Set(productos.map(p => p.deporte).filter(Boolean))]
const marcas = [...new Set(productos.map(p => p.marca).filter(Boolean))]
  const hayFiltros = Boolean(busqueda || categoria || deporte || marca)
  const toggleCarrito = (product) => {
    const enCarrito = cart
      .filter(item => item.id === product.id)
      .reduce((total, item) => total + item.cantidad, 0)
    if (product.stock !== undefined && enCarrito >= product.stock) {
      toast.error(`No hay más stock disponible. Solo hay ${product.stock} unidades.`)
      return
    }
    const tallaSeleccionada = product.tallaSeleccionada || ""
    const existente = cart.findIndex(item => item.id === product.id && item.tallaSeleccionada === tallaSeleccionada)
    if (existente >= 0) {
      setCart(cart.map((item, index) => index === existente ? { ...item, cantidad: item.cantidad + 1 } : item))
      return
    }
    setCart([...cart, { ...product, tallaSeleccionada, cantidad: 1, agregadoEn: Date.now() }])
  }

  const quitarDelCarrito = (index) => {
    setCart(cart.filter((_, i) => i !== index))
  }

  const restaurarAlCarrito = (item, index) => {
    setCart(actual => {
      const copia = [...actual]
      copia.splice(Math.min(index, copia.length), 0, item)
      return copia
    })
  }

  const cambiarCantidad = (index, nuevaCantidad) => {
    const item = cart[index]
    if (!item || nuevaCantidad < 1) return
    const otrasUnidades = cart
      .filter((otro, i) => i !== index && otro.id === item.id)
      .reduce((total, otro) => total + otro.cantidad, 0)
    if (item.stock !== undefined && otrasUnidades + nuevaCantidad > item.stock) {
      toast.error(`Solo hay ${item.stock} unidades disponibles.`)
      return
    }
    setCart(cart.map((actual, i) => i === index ? { ...actual, cantidad: nuevaCantidad } : actual))
  }

  const cambiarTalla = (index, talla) => {
    const item = cart[index]
    if (!item) return
    const repetido = cart.findIndex((otro, i) => i !== index && otro.id === item.id && otro.tallaSeleccionada === talla)
    if (repetido >= 0) {
      const cantidadCombinada = cart[repetido].cantidad + item.cantidad
      if (item.stock !== undefined && cantidadCombinada > item.stock) {
        toast.error(`Solo hay ${item.stock} unidades disponibles.`)
        return
      }
      setCart(cart
        .filter((_, i) => i !== index)
        .map((actual) => actual === cart[repetido] ? { ...actual, cantidad: cantidadCombinada } : actual))
      return
    }
    setCart(cart.map((actual, i) => i === index ? { ...actual, tallaSeleccionada: talla } : actual))
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
  const unidadesCarrito = cart.reduce((total, item) => total + item.cantidad, 0)
  return (
    <>
    <Toaster richColors position="top-center" />
    <Routes>
      <Route path="/iniciodesesión" element={<Iniciosesión />} />
      <Route path="/Registro" element={<Registro/>} />
      <Route path="/mis-compras" element={<><Navbar cartCount={unidadesCarrito} /><MisCompras /></>} />
      <Route path="/pago" element={<><Navbar cartCount={unidadesCarrito} /><Pago cart={cart} vaciarCarrito={vaciarCarrito} /></>} />
      <Route
        path='/'
        element={
          <>
            <Navbar cartCount={unidadesCarrito} />
            <div className="min-h-screen bg-slate-950 text-white flex flex-col">
              <main className="relative flex-1 overflow-hidden pt-24 pb-20">

    <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-green-500/10 blur-3xl"></div>

    <div className="absolute top-96 right-0 w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-3xl pointer-events-none"></div>

    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Portada />
                <section id="catalogo" className="scroll-mt-28 pt-16">
                  <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <span className="text-sm font-bold uppercase tracking-[0.22em] text-blue-400">Nuestro catálogo</span>
                      <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Productos destacados</h2>
                    </div>
                    {!cargando && !errorCatalogo && (
                      <p className="text-sm text-slate-400">{productosFiltrados.length} producto{productosFiltrados.length !== 1 ? 's' : ''}</p>
                    )}
                  </div>

<div className="mb-10">

  <div className="flex flex-col gap-3 lg:flex-row">
  <div className="relative flex-1">
    <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
    <input
      type="text"
      placeholder="Buscar productos..."
      value={busqueda}
      onChange={(e)=>setBusqueda(e.target.value)}
      className="w-full rounded-xl border border-slate-800 bg-slate-900/60 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-blue-500/70 focus:bg-slate-900"
    />
  </div>

    <div className="grid flex-1 grid-cols-2 gap-2 sm:grid-cols-3 lg:flex-none">

    <FilterSelect
      value={categoria}
      onChange={setCategoria}
      placeholder="Categoría"
      options={categorias}
    />

    <FilterSelect
      value={deporte}
      onChange={setDeporte}
      placeholder="Deporte"
      options={deportes}
    />

    <FilterSelect
      value={marca}
      onChange={setMarca}
      placeholder="Marca"
      options={marcas}
      className="col-span-2 sm:col-span-1"
    />

    </div>

  </div>

    {hayFiltros && <button
      onClick={()=>{
        setBusqueda("")
        setCategoria("")
        setDeporte("")
        setMarca("")
      }}
     className="ml-auto mt-2 flex items-center justify-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-slate-500 transition hover:text-white"
    >
      <X size={16} /> Limpiar
    </button>}

</div>
               <div>
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

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
                        cart={cart}
                        toggleCarrito={toggleCarrito}
                      />
                    ))
                  )}

  </div>
                </div>
                </section>
                </div>
              </main>

              <footer className="border-t border-slate-800 bg-slate-950 py-5">
                <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400"><Mail size={18} /></div>
                    <div><h3 className="text-sm font-bold">
                      Promociones Exclusivas
                    </h3>
                    <p className="text-xs text-slate-500">
                      Recibe ofertas y novedades semanales.
                    </p></div>
                  </div>

                  {!suscrito ? (
                    <div className="flex w-full flex-col gap-2 sm:flex-row md:w-auto">
                      <input
                        type="email"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        placeholder="Tu correo"
                        className="min-w-56 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500"
                      />
                      <button
                        onClick={suscribirse}
                        className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold transition hover:bg-blue-500"
                      >
                        Suscribirme <ArrowRight size={17} />
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
            <Navbar cartCount={unidadesCarrito} />
            <Carrito cart={cart} vaciarCarrito={vaciarCarrito} quitarDelCarrito={quitarDelCarrito} restaurarAlCarrito={restaurarAlCarrito} cambiarCantidad={cambiarCantidad} cambiarTalla={cambiarTalla} />
          </>
          
        }
      />
      <Route
      path="/producto/:id"
      element={
        <>
          <Navbar cartCount={unidadesCarrito} />
          <ProductoDetalle toggleCarrito={toggleCarrito} cart={cart} />
        </>
      } />
    </Routes>
    </>
  )
}

export default App;
