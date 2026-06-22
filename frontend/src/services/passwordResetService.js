import { apiFetch } from "./httpClient";

export async function createResetToken(email) {
 const response = await apiFetch("/password-reset/resetToken", {
    method: "POST",
    body: JSON.stringify({email})
 })

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

export async function resetPassword(resetToken, password){
    const response = await apiFetch("/password-reset/passwordReset", {
    method: "PATCH",
    body: JSON.stringify({resetToken, password})
 })

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