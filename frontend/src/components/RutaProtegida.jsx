import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RutaProtegida({ children }) {
  const { usuario, cargando } = useAuth();

  // 1. Si el contexto aún está verificando la sesión, mostramos un mensaje de carga
  if (cargando) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px", fontFamily: "Arial" }}>
        <p>Verificando sesión...</p>
      </div>
    );
  }

  // 2. Si terminó de cargar y no hay usuario, redirige al login
  if (!usuario) {
    return <Navigate to="/" replace />;
  }

  // 3. Si todo está bien, muestra el componente protegido (Clientes, Técnicos, Servicios, etc.)
  return children;
}

export default RutaProtegida;