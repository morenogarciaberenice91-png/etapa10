const API_URL = "http://127.0.0.1:5000/api/clientes";
const API_TECNICOS = "http://127.0.0.1:5000/api/tecnicos";

// ==========================================
// FUNCIONES DE CLIENTES
// ==========================================
export async function obtenerClientes() {
  const r = await fetch(API_URL);
  return { ok: r.ok, datos: await r.json() };
}

export async function crearCliente(cliente) {
  const r = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cliente)
  });
  return { ok: r.ok, datos: await r.json() };
}

export async function actualizarCliente(id, cliente) {
  const r = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cliente)
  });
  return { ok: r.ok, datos: await r.json() };
}

export async function eliminarCliente(id) {
  const r = await fetch(`${API_URL}/${id}`, { 
    method: "DELETE" 
  });
  return { ok: r.ok, datos: await r.json() };
}

// ==========================================
// FUNCIONES DE TÉCNICOS
// ==========================================
export async function obtenerTecnicos() {
  const r = await fetch(API_TECNICOS);
  return { ok: r.ok, datos: await r.json() };
}

export async function crearTecnico(tecnico) {
  const r = await fetch(API_TECNICOS, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tecnico)
  });
  return { ok: r.ok, datos: await r.json() };
}

export async function actualizarTecnico(id, tecnico) {
  const r = await fetch(`${API_TECNICOS}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tecnico)
  });
  return { ok: r.ok, datos: await r.json() };
}

export async function eliminarTecnico(id) {
  const r = await fetch(`${API_TECNICOS}/${id}`, { 
    method: "DELETE" 
  });
  return { ok: r.ok, datos: await r.json() };
}

// ==========================================
// FUNCIONES DE AUTENTICACIÓN
// ==========================================
export async function login(credenciales) {
  const payload = {
    username: credenciales?.username || credenciales?.usuario || "admin",
    password: credenciales?.password || credenciales?.contrasena || "123456"
  };

  const r = await fetch("http://127.0.0.1:5000/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  
  return { ok: r.ok, datos: await r.json() };
}