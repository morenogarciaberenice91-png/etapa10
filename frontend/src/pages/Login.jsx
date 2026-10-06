import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../App.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [exito, setExito] = useState(false);
  const navigate = useNavigate();
  const { iniciarSesion } = useAuth();

  const manejarLogin = async (e) => {
    e.preventDefault();
    setMensaje("");

    const u = username.trim();
    const p = password.trim();

    if (!u || !p) {
      setMensaje("Username y contraseña son obligatorios");
      setExito(false);
      return;
    }

    try {
      // Petición directa al backend enviando el JSON correcto
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: u, password: p }),
      });

      const datos = await res.json();

      if (res.ok && datos.success) {
        iniciarSesion(datos.usuario || { username: u });
        setExito(true);
        setMensaje("Inicio de sesión exitoso");
        navigate("/dashboard");
      } else {
        setExito(false);
        setMensaje(datos.message || "Usuario o contraseña incorrectos");
      }
    } catch (error) {
      console.error(error);
      setExito(false);
      setMensaje("No se pudo conectar con el servidor");
    }
  };

  return (
    <div className="contenedor">
      <div className="login">
        <h1>Servicios Técnicos</h1>
        <h2>Iniciar sesión</h2>
        <form onSubmit={manejarLogin}>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Ingrese su username"
            autoComplete="off"
          />
          <label>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ingrese su contraseña"
            autoComplete="new-password"
          />
          <button type="submit">Ingresar</button>
        </form>
        {mensaje && (
          <p className={exito ? "mensaje exito" : "mensaje error"}>
            {mensaje}
          </p>
        )}
      </div>
    </div>
  );
}

export default Login;