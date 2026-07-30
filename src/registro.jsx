import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./autentificación.jsx";

function Registro() {
  const { signUp } = useAuth();

  const navigate = useNavigate();

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMensaje("");

    if (password !== confirmarPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setLoading(true);

    const { error } = await signUp(correo, password);

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setMensaje(
      "Cuenta creada correctamente. Revisa tu correo para confirmar tu cuenta."
    );

    setTimeout(() => {
      navigate("/iniciodesesión");
    }, 2500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">

      <form
        onSubmit={handleSubmit}
        className="bg-slate-800 p-8 rounded-xl shadow-xl w-full max-w-md"
      >

        <h1 className="text-3xl font-bold text-center text-white mb-6">
          Crear cuenta
        </h1>

        {error && (
          <div className="bg-red-600 text-white rounded p-3 mb-4">
            {error}
          </div>
        )}

        {mensaje && (
          <div className="bg-green-600 text-white rounded p-3 mb-4">
            {mensaje}
          </div>
        )}

        <input
          type="email"
          placeholder="Correo electrónico"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          className="w-full p-3 rounded bg-slate-700 text-white mb-4"
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 rounded bg-slate-700 text-white mb-4"
          required
        />

        <input
          type="password"
          placeholder="Confirmar contraseña"
          value={confirmarPassword}
          onChange={(e) => setConfirmarPassword(e.target.value)}
          className="w-full p-3 rounded bg-slate-700 text-white mb-6"
          required
        />

        <button
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 transition rounded p-3 text-white font-bold disabled:opacity-50"
        >
          {loading ? "Creando cuenta..." : "Crear cuenta"}
        </button>

        <p className="text-center text-slate-300 mt-5">
          ¿Ya tienes cuenta?

          <Link
            to="/iniciodesesión"
            className="text-blue-400 ml-2"
          >
            Inicia sesión
          </Link>
        </p>

      </form>

    </div>
  );
}

export default Registro;