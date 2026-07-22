#!/usr/bin/env node

const fs = require("fs");

console.log("\n🔧 A configurar frontend CondoManager AI...\n");

// ------------------------------------------------------
// Criar pastas necessárias
// ------------------------------------------------------
const dirs = [
  "frontend/src/auth",
  "frontend/src/guards",
  "frontend/src/pages/protected"
];

dirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Pasta criada: ${dir}`);
  }
});

// ------------------------------------------------------
// AuthProvider.js
// ------------------------------------------------------
fs.writeFileSync(
  "frontend/src/auth/AuthProvider.jsx",
  `
import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, supabase }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
`
);
console.log("📌 AuthProvider.jsx criado.");

// ------------------------------------------------------
// ProtectedRoute.jsx
// ------------------------------------------------------
fs.writeFileSync(
  "frontend/src/guards/ProtectedRoute.jsx",
  `
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
`
);
console.log("📌 ProtectedRoute.jsx criado.");

// ------------------------------------------------------
// RoleGuard.jsx
// ------------------------------------------------------
fs.writeFileSync(
  "frontend/src/guards/RoleGuard.jsx",
  `
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
`
);
console.log("📌 RoleGuard.jsx criado.");

// ------------------------------------------------------
// Página protegida de exemplo
// ------------------------------------------------------
fs.writeFileSync(
  "frontend/src/pages/protected/AdminPage.jsx",
  `
export default function AdminPage() {
  return (
    <div>
      <h1>Área Administrativa</h1>
      <p>Apenas administradores podem ver esta página.</p>
    </div>
  );
}
`
);
console.log("📌 AdminPage.jsx criado.");

// ------------------------------------------------------
// Atualizar main.jsx para usar AuthProvider
// ------------------------------------------------------
const mainPath = "frontend/src/main.jsx";
let mainContent = fs.readFileSync(mainPath, "utf8");

if (!mainContent.includes("AuthProvider")) {
  mainContent = mainContent.replace(
    "<RouterProvider",
    `<AuthProvider>\n    <RouterProvider`
  );

  mainContent = mainContent.replace(
    "</RouterProvider>",
    "</RouterProvider>\n  </AuthProvider>"
  );

  fs.writeFileSync(mainPath, mainContent);
  console.log("📌 main.jsx atualizado com AuthProvider.");
}

// ------------------------------------------------------
// Finalização
// ------------------------------------------------------
console.log("\n🎉 Frontend configurado com sucesso!");
console.log("➡️ Agora podes proteger rotas com ProtectedRoute e RoleGuard.\n");
