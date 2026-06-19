const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function headers() {
  const h = { "Content-Type": "application/json" };
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) {
      h["Authorization"] = `Bearer ${token}`;
    }
  }
  return h;
}

let onUnauthorizedCallback = null;

export function setOnUnauthorized(cb) {
  onUnauthorizedCallback = cb;
}

export async function handleResponse(response) {
  if (response.ok) {
    return response.json();
  }

  if (response.status === 401) {
    if (onUnauthorizedCallback) {
      onUnauthorizedCallback();
    }
    throw new Error("Sesion expirada. Por favor, inicia sesion de nuevo.");
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

export async function apiFetch(url, options = {}) {
  const { headers: customHeaders, ...rest } = options;
  return fetch(`${API_URL}${url}`, {
    ...rest,
    credentials: "include",
    headers: {
      ...headers(),
      ...customHeaders,
    },
  });
}

export { API_URL };