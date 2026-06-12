import { API_URL, headers, handleResponse } from "./httpClient";

export async function createSession(token, { stack, level }) {
  const response = await fetch(`${API_URL}/sessions/`, {
    method: "POST",
    headers: headers(token),
    body: JSON.stringify({ stack, level }),
  });
  return handleResponse(response);
}

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

export async function completeSession(token, sessionId) {
  const response = await fetch(`${API_URL}/sessions/${sessionId}/complete`, {
    method: "POST",
    headers: headers(token),
  });
  return handleResponse(response);
}

export async function getMyStats(token) {
  const response = await fetch(`${API_URL}/me/stats`, {
    method: "GET",
    headers: headers(token),
  });
  return handleResponse(response);
}

export async function saveCard(token, {
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
    headers: headers(token),
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
