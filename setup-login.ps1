# Ir para pasta frontend/react
Set-Location "./frontend/react"

# Garantir pastas
New-Item -ItemType Directory -Path "src/lib" -Force | Out-Null
New-Item -ItemType Directory -Path "src/context" -Force | Out-Null
New-Item -ItemType Directory -Path "src/pages" -Force | Out-Null
New-Item -ItemType Directory -Path "src/components" -Force | Out-Null

# 1) supabaseClient.js
@"
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
"@ | Set-Content "src/lib/supabaseClient.js"

# 2) AuthContext.jsx
@"
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
"@ | Set-Content "src/context/AuthContext.jsx"

# 3) Login.jsx
@"
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      setError(error.message);
      return;
    }

    window.location.href = "/dashboard";
  }

  return (
    <div className="login-container">
      <form onSubmit={handleLogin}>
        <h2>Login</h2>

        {error && <p className="error">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}
"@ | Set-Content "src/pages/Login.jsx"

# 4) ProtectedRoute.jsx
@"
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  return children;
}
"@ | Set-Content "src/components/ProtectedRoute.jsx"

# 5) Dashboard.jsx (placeholder)
@"
export default function Dashboard() {
  return <h1>Dashboard</h1>;
}
"@ | Set-Content "src/pages/Dashboard.jsx"

# 6) router.jsx
@"
import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    )
  },
  {
    path: "/",
    element: <Login />
  }
]);
"@ | Set-Content "src/router.jsx"

# 7) main.jsx (envolver com AuthProvider)
@"
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);
"@ | Set-Content "src/main.jsx"

# 8) .env.example para Vercel
@"
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxxxxxxxxxxxxxxxxxxxxxxx
"@ | Set-Content ".env.example"

Write-Host "Login setup files created. Agora: git add ., commit, push e redeploy no Vercel."
