/**
 * CondoManager AI — setup-v3-ai.cjs
 * Bloco 11: Fluxo IA (AI Studio + Logs + Ações)
 */

const fs = require("fs");
const path = require("path");

function writeFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
  console.log("📄 Criado/Atualizado:", filePath);
}

/* ============================================================
   1. Serviço de IA (ligação ao Supabase AI Studio)
   ============================================================ */

writeFile(
  "frontend/src/services/aiService.js",
  `
import { supabase } from './supabaseClient';

export async function askAI(prompt) {
  // Chamada ao Supabase AI Studio
  const { data, error } = await supabase.functions.invoke('ai', {
    body: { prompt }
  });

  // Log automático
  await supabase.from('ia_logs').insert({
    utilizador: 'frontend',
    acao: 'askAI',
    detalhes: prompt
  });

  if (error) return 'Erro ao comunicar com IA.';
  return data?.response || 'Sem resposta.';
}
`
);

/* ============================================================
   2. Componente AIConsole
   ============================================================ */

writeFile(
  "frontend/src/components/AIConsole.jsx",
  `
import React, { useState } from 'react';
import Card from './Card';
import Button from './Button';
import Input from './Input';
import { askAI } from '../services/aiService';

export default function AIConsole() {
  const [prompt, setPrompt] = useState('');
  const [resposta, setResposta] = useState('');

  async function enviar() {
    const r = await askAI(prompt);
    setResposta(r);
  }

  return (
    <Card title="Assistente IA">
      <Input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Pergunte algo ao Assistente IA..."
      />
      <Button onClick={enviar}>Enviar</Button>

      {resposta && (
        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          backgroundColor: 'var(--bg2)',
          borderRadius: '8px'
        }}>
          <strong>Resposta:</strong>
          <p>{resposta}</p>
        </div>
      )}
    </Card>
  );
}
`
);

/* ============================================================
   3. Página Assistente IA
   ============================================================ */

writeFile(
  "frontend/src/pages/AssistenteIA.jsx",
  `
import React from 'react';
import Sidebar from '../components/Sidebar';
import AIConsole from '../components/AIConsole';

export default function AssistenteIA() {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />

      <div style={{ marginLeft: '260px', padding: '2rem', width: '100%' }}>
        <h1>Assistente IA</h1>
        <AIConsole />
      </div>
    </div>
  );
}
`
);

/* ============================================================
   4. Atualizar Router para incluir Assistente IA
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
import AssistenteIA from '../pages/AssistenteIA';

import ProtectedRoute from '../components/ProtectedRoute';
import { UserProvider } from '../context/UserContext';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <UserProvider>
        <Routes>

          <Route
            path="/gestor/dashboard"
            element={
              <ProtectedRoute allow={['gestor']}>
                <DashboardGestor />
              </ProtectedRoute>
            }
          />

          <Route
            path="/modulos/intervencoes"
            element={
              <ProtectedRoute allow={['gestor', 'fornecedor']}>
                <Intervencoes />
              </ProtectedRoute>
            }
          />

          <Route
            path="/modulos/obras"
            element={
              <ProtectedRoute allow={['gestor']}>
                <Obras />
              </ProtectedRoute>
            }
          />

          <Route
            path="/modulos/limpezas"
            element={
              <ProtectedRoute allow={['gestor']}>
                <Limpezas />
              </ProtectedRoute>
            }
          />

          <Route
            path="/modulos/financeiro"
            element={
              <ProtectedRoute allow={['gestor', 'proprietario']}>
                <Financeiro />
              </ProtectedRoute>
            }
          />

          <Route path="/assistente-ia" element={<AssistenteIA />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/acesso-negado" element={<AcessoNegado />} />

        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}
`
);

/* ============================================================
   FINAL
   ============================================================ */

console.log("\\n🎯 Bloco 11 concluído com sucesso!");
console.log("Fluxo IA criado automaticamente (AI Studio + Logs + Console).");
