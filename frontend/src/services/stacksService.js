// URL base de la API, leida de las variables de entorno de Next.js
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Maneja la respuesta del backend, lanzando error si no es OK
async function handleResponse(response) {
  if (response.ok) {
    return response.json();
  }

  let errorMsg;
  try {
    const data = await response.json();
    errorMsg = data.error || data.Error || data.msg || data.message;
  } catch {
    errorMsg = null;
  }

  throw new Error(errorMsg || `Error ${response.status}: ${response.statusText}`);
}

// GET /stacks/ — devuelve roles con sus stacks y los niveles disponibles
export async function getStacks() {
  const response = await fetch(`${API_URL}/stacks/`);
  return handleResponse(response);
}
