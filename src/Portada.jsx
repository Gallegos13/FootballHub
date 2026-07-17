import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag } from "lucide-react";

export default function Portada() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 px-8 py-12 md:px-16 md:py-16">
      <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl"></div>

      <div className="relative z-10 grid items-center gap-12 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="rounded-full bg-blue-600/20 px-4 py-2 text-sm font-semibold text-blue-400">
            Bienvenido a SportHub
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-tight text-white md:text-5xl">
            Todo lo que necesitas para vivir el deporte.
          </h1>

          <p className="mt-6 max-w-lg text-lg text-slate-300">
            Descubre jerseys oficiales, balones, calzado y accesorios de las
            mejores marcas. Compra fácil, rápido y seguro desde un solo lugar.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500">
              <ShoppingBag size={20} />
              Comprar ahora
            </button>

            <button className="flex items-center gap-2 rounded-xl border border-slate-700 px-6 py-3 font-semibold text-white transition hover:border-blue-500 hover:bg-slate-800">
              Explorar
              <ArrowRight size={18} />
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex justify-center"
        >
          <img
            src="././public/mexicobanner.png"
            alt="SportHub"
            className="w-full max-w-lg drop-shadow-2xl"
          />
        </motion.div>
      </div>
    </section>
  );
}