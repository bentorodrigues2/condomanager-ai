/**
 * CondoManager AI — setup-v3-permissions.cjs
 * Bloco 9: Sistema de Permissões Avançado (Gestor, Proprietário, Fornecedor)
 */

const fs = require("fs");
const path = require("path");

function writeFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
  console.log("📄 Criado/Atualizado:", filePath);
}

/* ============================================================
   1. Contexto Global de Utilizador
   ============================================================ */

writeFile(
  "frontend/src/context/UserContext.jsx",
  `
import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null); // { email, role }

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
`
);

/* ============================================================
   2. Hook useRole()
   ============================================================ */

writeFile(
  "frontend/src/hooks/useRole.js",
  `
import { useUser } from '../context/UserContext';

export default function useRole() {
  const { user } = useUser();
  return user?.role || 'guest';
}
`
);

/* ============================================================
   3. Componente ProtectedRoute
   ============================================================ */

writeFile(
  "frontend/src/components/ProtectedRoute.jsx",
  `
import React from 'react';
import { Navigate } from 'react-router-dom';
import useRole from '../hooks/useRole';

export default function ProtectedRoute({ children, allow }) {
  const role = useRole();

  if (!allow.includes(role)) {
    return <Navigate to="/acesso-negado" replace />;
  }

  return children;
}
`
);

/* ============================================================
   4. Página de Acesso Negado
   ============================================================ */

writeFile(
  "frontend/src/pages/AcessoNegado.jsx",
  `
import React from 'react';
import Sidebar from '../components/Sidebar';

export default function AcessoNegado() {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ marginLeft: '260px', padding: '2rem' }}>
        <h1>Acesso Negado</h1>
        <p>Não tem permissões para aceder a esta área.</p>
      </div>
    </div>
  );
}
`
);

/* ============================================================
   5. Atualizar Router para incluir permissões
   ============================================================ */

writeFile(
  "frontend/src/router/AppRouter.jsx",
  `
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import DashboardGestor from '../pages/gestor/Dashboard';
import Intervencoes from '../pages/modulos/intervencoes';
import Obras from '../pages/modulos/obras';
import Limpezas from '../pages/modulos/limpezas';
import Financeiro from '../pages/modulos/financeiro';
import Perfil from '../pages/Perfil';
import AcessoNegado from '../pages/AcessoNegado';

import ProtectedRoute from '../components/ProtectedRoute';
import { UserProvider } from '../context/UserContext';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <UserProvider>
        <Routes>

          {/* Gestor */}
          <Route
            path="/gestor/dashboard"
            element={
              <ProtectedRoute allow={['gestor']}>
                <DashboardGestor />
              </ProtectedRoute>
            }
          />

          {/* Intervenções (gestor + fornecedor) */}
          <Route
            path="/modulos/intervencoes"
            element={
              <ProtectedRoute allow={['gestor', 'fornecedor']}>
                <Intervencoes />
              </ProtectedRoute>
            }
          />

          {/* Obras (gestor) */}
          <Route
            path="/modulos/obras"
            element={
              <ProtectedRoute allow={['gestor']}>
                <Obras />
              </ProtectedRoute>
            }
          />

          {/* Limpezas (gestor) */}
          <Route
            path="/modulos/limpezas"
            element={
              <ProtectedRoute allow={['gestor']}>
                <Limpezas />
              </ProtectedRoute>
            }
          />

          {/* Financeiro (gestor + proprietário) */}
          <Route
            path="/modulos/financeiro"
            element={
              <ProtectedRoute allow={['gestor', 'proprietario']}>
                <Financeiro />
              </ProtectedRoute>
            }
          />

          {/* Perfil (todos) */}
          <Route path="/perfil" element={<Perfil />} />

          {/* Acesso Negado */}
          <Route path="/acesso-negado" element={<AcessoNegado />} />

        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}
`
);

/* ============================================================
   6. Simulação de Login (para testes)
   ============================================================ */

writeFile(
  "frontend/src/pages/Login.jsx",
  `
import React, { useState } from 'react';
import { useUser } from '../context/UserContext';

export default function Login() {
  const { setUser } = useUser();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('gestor');

  function entrar() {
    setUser({ email, role });
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Login</h1>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ padding: '1rem', width: '100%', marginBottom: '1rem' }}
      />

      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        style={{ padding: '1rem', width: '100%', marginBottom: '1rem' }}
      >
        <option value="gestor">Gestor</option>
        <option value="proprietario">Proprietário</option>
        <option value="fornecedor">Fornecedor</option>
      </select>

      <button
        onClick={entrar}
        style={{
          padding: '1rem',
          width: '100%',
          backgroundColor: 'var(--primary)',
          color: '#fff',
          border: 'none',
          borderRadius: '8px'
        }}
      >
        Entrar
      </button>
    </div>
  );
}
`
);

/* ============================================================
   FINAL
   ============================================================ */

console.log("\\n🎯 Bloco 9 concluído com sucesso!");
console.log("Sistema de permissões avançado criado automaticamente.");
