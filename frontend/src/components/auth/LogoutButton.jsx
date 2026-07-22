
import { useAuth } from "../../auth/AuthProvider";

export default function LogoutButton() {
  const { supabase } = useAuth();

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return <button onClick={logout}>Sair</button>;
}
