export function requireAuth() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  return !!user;
}

export function getUserRole() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  return user?.papel || null;
}
