// URL base de la API, leida de las variables de entorno de Next.js
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Cabeceras comunes para peticiones que no requieren autenticacion
function headers() {
  return { "Content-Type": "application/json" };
}

// Maneja la respuesta del backend, lanzando error si no es OK
async function handleResponse(response) {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.Error || data.msg || data.message || "Error en la peticion");
  }
  return data;
}

// POST /auth/login — autentica al usuario y devuelve token JWT + datos del usuario
export async function loginUser(email, password) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(response);
}

// POST /auth/register — crea una cuenta nueva de usuario
export async function registerUser(name, email, password) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ name, email, password }),
  });
  return handleResponse(response);
}
