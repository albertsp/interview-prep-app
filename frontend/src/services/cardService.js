import { apiFetch, handleResponse } from "./httpClient";

export async function getCards() {
  const response = await apiFetch("/cards/", {
    method: "GET",
  });
  return handleResponse(response);
}

export async function updateCard(cardId, data) {
  const response = await apiFetch(`/cards/${cardId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

export async function deleteCardById(cardId) {
  const response = await apiFetch(`/cards/${cardId}`, {
    method: "DELETE",
  });
  return handleResponse(response);
}