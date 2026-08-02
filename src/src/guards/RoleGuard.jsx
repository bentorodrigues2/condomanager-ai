
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { useEffect, useState } from "react";

export default function RoleGuard({ role, children }) {
  const { user, supabase } = useAuth();
  const [allowed, setAllowed] = useState(null);

  useEffect(() => {
    if (!user) {
      setAllowed(false);
      return;
    }

    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) {
          setAllowed(false);
        } else {
          setAllowed(data.role === role);
        }
      });
  }, [user]);

  if (allowed === null) return <p>A verificar permissões...</p>;

  if (!allowed) return <Navigate to="/no-access" replace />;

  return children;
}
