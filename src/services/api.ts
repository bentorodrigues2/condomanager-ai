const API_BASE = import.meta.env.VITE_RENDER_API || "http://localhost:3000";

/* ============================
   LOCAL STORAGE HELPERS
   ============================ */

export function getStoredToken() {
  return localStorage.getItem("auth_token");
}

export function getStoredUser() {
  const raw = localStorage.getItem("auth_user");
  return raw ? JSON.parse(raw) : null;
}

export function setStoredAuth(token, user) {
  localStorage.setItem("auth_token", token);
  localStorage.setItem("auth_user", JSON.stringify(user));
}

/* ============================
   API WRAPPER
   ============================ */

export async function api(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options
  });

  if (!res.ok) throw new Error("Erro na API");
  return res.json();
}

export async function apiGet(path) {
  return api(path);
}

export async function apiPost(path, body) {
  return api(path, {
    method: "POST",
    body: JSON.stringify(body)
  });
}








