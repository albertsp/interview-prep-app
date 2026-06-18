import { apiFetch, handleResponse } from "./httpClient";

export async function getProfile() {
  const response = await apiFetch("/me/profile", {
    method: "GET",
  });
  return handleResponse(response);
}

export async function updateProfile(name) {
  const response = await apiFetch("/me/profile", {
    method: "PATCH",
    body: JSON.stringify({ name }),
  });
  return handleResponse(response);
}