/**
 * CondoManager AI — setup-v3-ui-pages.cjs
 * Bloco 2: Landing Page, Login, Dashboards, Estrutura de Módulos
 */

const fs = require("fs");
const path = require("path");

// Utilitário para criar ficheiros
function writeFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
  console.log("📄 Criado:", filePath);
}

// === 1. Landing Page ===
writeFile(
  "frontend/src/pages/LandingPage.jsx",
  `
import React from 'react';
import '../styles/theme.css';

export default function LandingPage() {
  return (
    <div style={{ backgroundColor: 'var(--bg)', color: 'var(--text)', padding: '2rem' }}>
      <h1>CondoManager AI</h1>
      <p>PWA & Automação Ativa</p>

      <div style={{ marginTop: '2rem' }}>
        <button style={{
          backgroundColor: 'var(--primary)',
          color: '#fff',
          padding: '1rem',
          borderRadius: '8px',
          border: 'none'
        }}>
          Entrar
        </button>
      </div>
    </div>
  );
}
`
);

// === 2. Login ===
writeFile(
  "frontend/src/pages/Login.jsx",
  `
import React, { useState } from 'react';
import { supabase } from '../config/supabase';
import '../styles/theme.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleLogin() {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      alert('Erro ao entrar');
      return;
    }

    const user = data.user.email;

    if (user.includes('gestor')) window.location.href = '/gestor/dashboard';
    else if (user.includes('proprietario')) window.location.href = '/proprietario/painel';
    else window.location.href = '/perfil';
  }

  return (
    <div style={{ backgroundColor: 'var(--bg)', color: 'var(--text)', padding: '2rem' }}>
      <h2>Entrar</h2>

      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        style={{ padding: '1rem', marginTop: '1rem', width: '100%' }}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        style={{ padding: '1rem', marginTop: '1rem', width: '100%' }}
      />

      <button
        onClick={handleLogin}
        style={{
          backgroundColor: 'var(--primary)',
          color: '#fff',
          padding: '1rem',
          marginTop: '1rem',
          borderRadius: '8px',
          border: 'none',
          width: '100%'
        }}
      >
        Entrar
      </button>
    </div>
  );
}
`
);

// === 3. Dashboard Gestor ===
writeFile(
  "frontend/src/pages/gestor/Dashboard.jsx",
  `
import React from 'react';
import '../../styles/theme.css';

export default function DashboardGestor() {
  return (
    <div style={{ backgroundColor: 'var(--bg)', color: 'var(--text)', padding: '2rem' }}>
      <h1>Dashboard do Gestor</h1>
      <p>Resumo geral do condomínio</p>
    </div>
  );
}
`
);

// === 4. Painel Proprietário ===
writeFile(
  "frontend/src/pages/proprietario/Painel.jsx",
  `
import React from 'react';
import '../../styles/theme.css';

export default function PainelProprietario() {
  return (
    <div style={{ backgroundColor: 'var(--bg)', color: 'var(--text)', padding: '2rem' }}>
      <h1>Painel do Proprietário</h1>
      <p>Informações da sua fração</p>
    </div>
  );
}
`
);

// === 5. Estrutura de módulos ===
const modules = [
  "financeiro",
  "obras",
  "limpeza",
  "intervencoes",
  "documentos",
  "historico",
  "exportacao",
  "ia"
];

modules.forEach((mod) => {
  writeFile(
    `frontend/src/pages/modulos/${mod}.jsx`,
    `
import React from 'react';
import '../../styles/theme.css';

export default function ${mod.charAt(0).toUpperCase() + mod.slice(1)}() {
  return (
    <div style={{ backgroundColor: 'var(--bg)', color: 'var(--text)', padding: '2rem' }}>
      <h1>${mod.charAt(0).toUpperCase() + mod.slice(1)}</h1>
      <p>Módulo em construção...</p>
    </div>
  );
}
`
  );
});

// === Final ===
console.log("\\n🎯 Bloco 2 concluído com sucesso!");
console.log("Landing Page, Login, Dashboards e Módulos criados.");
