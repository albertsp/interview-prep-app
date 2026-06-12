import { API_URL, handleResponse } from "./httpClient";

export async function getStacks() {
  const response = await fetch(`${API_URL}/stacks/`);
  return handleResponse(response);
}
