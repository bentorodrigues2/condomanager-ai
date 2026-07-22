#!/usr/bin/env node

const fs = require("fs");

console.log("\n🔧 A criar sistema de autenticação no frontend...\n");

// ------------------------------------------------------
// Criar pastas
// ------------------------------------------------------
const dirs = [
  "frontend/src/pages/auth",
  "frontend/src/components/auth"
];

dirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Pasta criada: ${dir}`);
  }
});

// ------------------------------------------------------
// LoginPage.jsx
// ------------------------------------------------------
fs.writeFileSync(
  "frontend/src/pages/auth/LoginPage.jsx",
  `
import { useState } from "react";
import { useAuth } from "../../auth/AuthProvider";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { supabase } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    navigate("/");
  }

  return (
    <div>
      <h1>Login</h1>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Entrar</button>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}
`
);
console.log("📌 LoginPage.jsx criado.");

// ------------------------------------------------------
// SignupPage.jsx
// ------------------------------------------------------
fs.writeFileSync(
  "frontend/src/pages/auth/SignupPage.jsx",
  `
import { useState } from "react";
import { useAuth } from "../../auth/AuthProvider";
import { useNavigate } from "react-router-dom";

export default function SignupPage() {
  const { supabase } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSignup(e) {
    e.preventDefault();

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    navigate("/login");
  }

  return (
    <div>
      <h1>Criar Conta</h1>

      <form onSubmit={handleSignup}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Criar Conta</button>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}
`
);
console.log("📌 SignupPage.jsx criado.");

// ------------------------------------------------------
// LogoutButton.jsx
// ------------------------------------------------------
fs.writeFileSync(
  "frontend/src/components/auth/LogoutButton.jsx",
  `
import { useAuth } from "../../auth/AuthProvider";

export default function LogoutButton() {
  const { supabase } = useAuth();

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return <button onClick={logout}>Sair</button>;
}
`
);
console.log("📌 LogoutButton.jsx criado.");

// ------------------------------------------------------
// Finalização
// ------------------------------------------------------
console.log("\n🎉 Sistema de autenticação criado com sucesso!");
console.log("➡️ Agora adiciona rotas /login e /signup no teu router.\n");
