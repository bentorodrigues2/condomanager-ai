
import React, { useEffect, useState } from "react";
import AppRouter from "./router.jsx";
import BottomBar from "./BottomBar.jsx";
import { supabase } from "./supabaseClient.js";

export default function App() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const r = data?.user?.user_metadata?.role;
      setRole(r);
    });
  }, []);

  if (!role) return <div>Carregando...</div>;

  return (
    <>
      <AppRouter role={role} />
      <BottomBar role={role} />
    </>
  );
}
