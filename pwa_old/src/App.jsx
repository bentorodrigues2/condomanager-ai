import React, { useEffect, useState } from "react";
import AppRouter from "./router.jsx";
import BottomBar from "./BottomBar.jsx";
import { supabase } from "./supabaseClient.js";
import Login from "./auth/Login.jsx";

export default function App() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const r = data?.user?.user_metadata?.role;
      setRole(r);
    });
  }, []);

  // Fallback temporário até integrar o AI Studio
  if (!role) return <Login />;

  return (
    <>
      <AppRouter role={role} />
      <BottomBar role={role} />
    </>
  );
}
