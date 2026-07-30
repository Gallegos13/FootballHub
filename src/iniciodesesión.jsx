import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "./autentificación.jsx";

function Iniciosesión() {
  const { signIn, signInWithGoogle } = useAuth();

  const navigate = useNavigate();

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    const { error } = await signIn(correo, password);

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    navigate("/");
  };
const handleGoogle = async () => {
  setError("");

  const { error } = await signInWithGoogle();

  if (error) {
    setError(error.message);
  }
};
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">

      <form
        onSubmit={handleSubmit}
        className="bg-slate-800 p-8 rounded-xl w-full max-w-md shadow-xl"
      >

        <h1 className="text-3xl text-center text-white font-bold mb-6">
          Iniciar sesión
        </h1>

        {error && (
          <div className="bg-red-600 text-white p-3 rounded mb-4">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Correo"
          value={correo}
          onChange={(e)=>setCorreo(e.target.value)}
          className="w-full p-3 rounded mb-4 bg-slate-700 text-white"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          className="w-full p-3 rounded mb-6 bg-slate-700 text-white"
        />

        <button
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 transition rounded p-3 text-white font-bold disabled:opacity-50"
        >
          {loading ? "Ingresando..." : "Entrar"}
        </button>
<div className="flex items-center my-5">
  <div className="flex-1 h-px bg-slate-600"></div>
  <span className="px-3 text-slate-400">o</span>
  <div className="flex-1 h-px bg-slate-600"></div>
</div>

<button
  type="button"
  onClick={handleGoogle}
  className="w-full bg-white text-black rounded-lg p-3 font-semibold hover:bg-gray-100 transition flex items-center justify-center gap-3"
>
  <img
    src="https://www.svgrepo.com/show/475656/google-color.svg"
    alt="Google"
    className="w-5 h-5"
  />
  Continuar con Google
</button>
        <p className="text-gray-300 text-center mt-5">
          ¿No tienes cuenta?
          <Link
            to="/Registro"
            className="text-blue-400 ml-2"
          >
            Crear cuenta
          </Link>
        </p>

      </form>

    </div>
  );
}

export default Iniciosesión;