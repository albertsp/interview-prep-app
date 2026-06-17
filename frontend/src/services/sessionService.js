import { API_URL, headers, handleResponse } from "./httpClient";

export async function createSession({ stack, level }) {
  const response = await fetch(`${API_URL}/sessions/`, {
    method: "POST",
    headers: headers(),
    credentials: "include",
    body: JSON.stringify({ stack, level }),
  });
  return handleResponse(response);
}

export async function submitAnswer(sessionId, questionId, answer) {
  const response = await fetch(
    `${API_URL}/sessions/${sessionId}/questions/${questionId}`,
    {
      method: "PATCH",
      headers: headers(),
      credentials: "include",
      body: JSON.stringify({ answer }),
    }
  );
  return handleResponse(response);
}

export async function completeSession(sessionId) {
  const response = await fetch(`${API_URL}/sessions/${sessionId}/complete`, {
    method: "POST",
    headers: headers(),
    credentials: "include",
  });
  return handleResponse(response);
}

export async function getMyStats() {
  const response = await fetch(`${API_URL}/me/stats`, {
    method: "GET",
    headers: headers(),
    credentials: "include",
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
  const response = await fetch(`${API_URL}/cards/`, {
    method: "POST",
    headers: headers(),
    credentials: "include",
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