function Carrito({ cart, vaciarCarrito, quitarDelCarrito }) {
  const total = cart.reduce((sum, item) => sum + Number(item.precio), 0)

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 pt-20">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold">
            Carrito de Compras
          </h1>
          {cart.length > 0 && (
            <button
              onClick={vaciarCarrito}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
            >
              Vaciar Carrito
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <p className="text-slate-400">Tu carrito está vacío.</p>
        ) : (
          <>
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 bg-slate-800 p-4 rounded-lg border border-slate-700"
                >
                  <img
                    className="w-16 h-16 object-contain"
                    src={item.imagen}
                    alt={item.nombre}
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{item.nombre}</h3>
                    <p className="text-slate-400 text-sm">{item.categoria}</p>
                  </div>
                  <span className="text-green-400 font-bold text-lg">
                    ${Number(item.precio).toFixed(2)}
                  </span>
                  <button
                    onClick={() => quitarDelCarrito(item.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm"
                  >
                    Quitar
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-slate-800 p-4 rounded-lg border border-slate-700 text-right">
              <p className="text-2xl font-bold">
                Total: <span className="text-green-400">${total.toFixed(2)}</span>
              </p>
              <button className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg text-lg font-semibold">
                Pagar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Carrito
