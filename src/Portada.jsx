import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag, ShieldCheck, Truck, RotateCcw } from "lucide-react";

export default function Portada() {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 px-6 py-10 shadow-2xl shadow-black/20 sm:px-10 md:px-14 md:py-16">
      <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl"></div>

      <div className="relative z-10 grid items-center gap-12 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-flex rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-300">
            Tu pasión, en un solo lugar
          </span>

          <h1 className="mt-6 text-4xl font-black leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Vive el deporte <span className="text-[#5b72ff]">a tu manera.</span>
          </h1>

          <p className="mt-6 max-w-lg text-lg text-slate-300">
            Descubre jerseys oficiales, balones, calzado y accesorios de las
            mejores marcas. Compra fácil, rápido y seguro desde un solo lugar.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <a href="#catalogo" className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-500">
              <ShoppingBag size={20} />
              Comprar ahora
            </a>

            <a href="#catalogo" className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/50 px-6 py-3 font-semibold text-white transition hover:border-blue-500 hover:bg-slate-800">
              Ver colección
              <ArrowRight size={18} />
            </a>
          </div>
          <div className="mt-9 flex flex-wrap gap-x-5 gap-y-3 text-sm text-slate-400">
            <span className="flex items-center gap-2"><ShieldCheck size={17} className="text-emerald-400" /> Compra segura</span>
            <span className="flex items-center gap-2"><Truck size={17} className="text-emerald-400" /> Envío gratis</span>
            <span className="flex items-center gap-2"><RotateCcw size={17} className="text-emerald-400" /> Cambios fáciles</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative flex justify-center"
        >
          <div className="absolute inset-8 rounded-full bg-blue-500/15 blur-3xl" />
          <img
            src="/mexicobanner.png"
            alt="SportHub"
            className="relative w-full max-w-lg drop-shadow-2xl transition duration-700 hover:scale-[1.03]"
          />
        </motion.div>
      </div>
    </section>
  );
}
