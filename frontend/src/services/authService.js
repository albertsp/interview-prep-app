import { API_URL, headers } from "./httpClient";

export async function loginUser(email, password) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: headers(),
    credentials: "include",
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
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: headers(),
    credentials: "include",
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
  const response = await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    headers: headers(),
    credentials: "include",
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