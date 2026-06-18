import { apiFetch, handleResponse } from "./httpClient";

export async function createSession({ stack, level }) {
  const response = await apiFetch("/sessions/", {
    method: "POST",
    body: JSON.stringify({ stack, level }),
  });
  return handleResponse(response);
}

export async function submitAnswer(sessionId, questionId, answer) {
  const response = await apiFetch(
    `/sessions/${sessionId}/questions/${questionId}`,
    {
      method: "PATCH",
      body: JSON.stringify({ answer }),
    }
  );
  return handleResponse(response);
}

export async function completeSession(sessionId) {
  const response = await apiFetch(`/sessions/${sessionId}/complete`, {
    method: "POST",
  });
  return handleResponse(response);
}

export async function getMyStats() {
  const response = await apiFetch("/me/stats", {
    method: "GET",
  });
  return handleResponse(response);
}

export async function saveCard({
  question_id,
  session_id,
  concept,
  definition,
  explanation,
  use_case,
  avoid_when,
  mnemonic,
  tags,
  code,
  code_language,
}) {
  const response = await apiFetch("/cards/", {
    method: "POST",
    body: JSON.stringify({
      question_id,
      session_id,
      concept,
      definition,
      explanation,
      use_case,
      avoid_when,
      mnemonic,
      tags,
      code,
      code_language,
    }),
  });
  return handleResponse(response);
}