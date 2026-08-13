export function canAccess(roleRequired: string) {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (!user) return false;

  const hierarchy = {
    admin: 3,
    gestor: 2,
    leitura: 1,
  };

  return hierarchy[user.papel] >= hierarchy[roleRequired];
}
