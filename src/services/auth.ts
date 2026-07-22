import { apiPost, getStoredToken, getStoredUser, setStoredAuth } from "./api";

export async function login(email, password) {
  const data = await apiPost("/auth/login", { email, password });
  setStoredAuth(data.token, data.user);
  return data.user;
}

export function logout() {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("auth_user");
}

export function getCurrentUser() {
  return getStoredUser();
}

export function getToken() {
  return getStoredToken();
}








