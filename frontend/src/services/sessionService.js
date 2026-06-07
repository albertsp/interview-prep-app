// URL base de la API, leida de las variables de entorno de Next.js
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Cabeceras para peticiones que requieren autenticacion JWT
function headers(token) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// Maneja la respuesta del backend, lanzando error si no es OK
async function handleResponse(response) {
  // Si la respuesta es exitosa, parseamos el JSON directamente
  if (response.ok) {
    return response.json();
  }

  // Si hay error, intentamos extraer el mensaje del body JSON del backend
  // Si el body no es JSON (ej. HTML de error de Flask), mostramos el status
  let errorMsg;
  try {
    const data = await response.json();
    errorMsg = data.error || data.Error || data.msg || data.message;
  } catch {
    // El backend devolvio algo que no es JSON (HTML, texto plano, etc.)
    errorMsg = null;
  }

  throw new Error(errorMsg || `Error ${response.status}: ${response.statusText}`);
}

// POST /sessions/ — crea una nueva sesion de entrevista con preguntas generadas por IA
export async function createSession(token, { stack, level }) {
  const response = await fetch(`${API_URL}/sessions/`, {
    method: "POST",
    headers: headers(token),
    body: JSON.stringify({ stack, level }),
  });
  return handleResponse(response);
}

// PATCH /sessions/:id/questions/:qid — envia la respuesta del usuario y obtiene feedback de la IA
export async function submitAnswer(token, sessionId, questionId, answer) {
  const response = await fetch(
    `${API_URL}/sessions/${sessionId}/questions/${questionId}`,
    {
      method: "PATCH",
      headers: headers(token),
      body: JSON.stringify({ answer }),
    }
  );
  return handleResponse(response);
}

// POST /cards/ — guarda una card de estudio en el backend
export async function saveCard(token, { question_id, session_id, concept, explanation, use_case, code, code_language }) {
  const response = await fetch(`${API_URL}/cards/`, {
    method: "POST",
    headers: headers(token),
    body: JSON.stringify({ question_id, session_id, concept, explanation, use_case, code, code_language }),
  });
  return handleResponse(response);
}
