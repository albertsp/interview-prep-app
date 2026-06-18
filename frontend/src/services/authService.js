import { apiFetch, handleResponse } from "./httpClient";

export async function loginUser(email, password) {
  const response = await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    let errorMsg;
    try {
      const data = await response.json();
      errorMsg = data.error || data.msg || data.message;
    } catch {
      errorMsg = null;
    }
    throw new Error(errorMsg || `Error ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

export async function registerUser(name, email, password) {
  const response = await apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });

  if (!response.ok) {
    let errorMsg;
    try {
      const data = await response.json();
      errorMsg = data.error || data.msg || data.message;
    } catch {
      errorMsg = null;
    }
    throw new Error(errorMsg || `Error ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

export async function logoutUser() {
  const response = await apiFetch("/auth/logout", {
    method: "POST",
  });
  return handleResponse(response);
}