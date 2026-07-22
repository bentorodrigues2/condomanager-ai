/**
 * CondoManager AI — setup-v3-superblock.cjs
 * Bloco 14: Chat Interno + Tarefas Automáticas + Relatórios PDF
 */

const fs = require("fs");
const path = require("path");

function writeFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
  console.log("📄 Criado/Atualizado:", filePath);
}

/* ============================================================
   1️⃣ MÓDULO DE CHAT INTERNO
   ============================================================ */

writeFile(
  "frontend/src/services/chatService.js",
  `
import { supabase } from './supabaseClient';

export async function sendMessage(channel, user, message) {
  await supabase.from('chat').insert({
    canal: channel,
    utilizador: user,
    mensagem: message
  });
}

export async function getMessages(channel) {
  const { data } = await supabase
    .from('chat')
    .select('*')
    .eq('canal', channel)
    .order('criado_em', { ascending: true });

  return data || [];
}
`
);

writeFile(
  "frontend/src/components/ChatWindow.jsx",
  `
import React, { useEffect, useState } from 'react';
import Button from './Button';
import Input from './Input';
import { sendMessage, getMessages } from '../services/chatService';
import { useUser } from '../context/UserContext';
import { supabase } from '../services/supabaseClient';

export default function ChatWindow({ canal }) {
  const { user } = useUser();
  const [mensagens, setMensagens] = useState([]);
  const [texto, setTexto] = useState('');

  async function carregar() {
    setMensagens(await getMessages(canal));
  }

  async function enviar() {
    if (!texto) return;
    await sendMessage(canal, user.email, texto);
    setTexto('');
  }

  useEffect(() => {
    carregar();

    const channel = supabase
      .channel('chat-' + canal)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat' }, carregar)
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [canal]);

  return (
    <div>
      <div style={{
        backgroundColor: 'var(--bg2)',
        padding: '1rem',
        borderRadius: '8px',
        height: '300px',
        overflowY: 'auto',
        marginBottom: '1rem'
      }}>
        {mensagens.map((m) => (
          <div key={m.id} style={{ marginBottom: '0.5rem' }}>
            <strong>{m.utilizador}:</strong> {m.mensagem}
          </div>
        ))}
      </div>

      <Input
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Escreva uma mensagem..."
      />
      <Button onClick={enviar}>Enviar</Button>
    </div>
  );
}
`
);

writeFile(
  "frontend/src/pages/modulos/chat.jsx",
  `
import React from 'react';
import Sidebar from '../../components/Sidebar';
import ChatWindow from '../../components/ChatWindow';

export default function Chat() {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ marginLeft: '260px', padding: '2rem', width: '100%' }}>
        <h1>Chat Interno</h1>
        <ChatWindow canal="geral" />
      </div>
    </div>
  );
}
`
);

/* ============================================================
   2️⃣ MÓDULO DE TAREFAS AUTOMÁTICAS
   ============================================================ */

writeFile(
  "frontend/src/services/autoTasks.js",
  `
import { supabase } from './supabaseClient';
import { askAI } from './aiService';

export async function executarTarefasAutomaticas() {
  const hoje = new Date().toISOString().split('T')[0];

  // Limpezas agendadas
  const { data: limpezas } = await supabase
    .from('limpezas')
    .select('*')
    .eq('data', hoje);

  if (limpezas.length > 0) {
    await supabase.from('ia_logs').insert({
      utilizador: 'sistema',
      acao: 'limpeza_hoje',
      detalhes: JSON.stringify(limpezas)
    });
  }

  // Obras atrasadas
  const { data: obras } = await supabase
    .from('obras')
    .select('*')
    .eq('estado', 'atrasada');

  if (obras.length > 0) {
    await supabase.from('ia_logs').insert({
      utilizador: 'sistema',
      acao: 'obras_atrasadas',
      detalhes: JSON.stringify(obras)
    });
  }

  // Análise IA diária
  const analise = await askAI("Resumo diário do condomínio.");
  await supabase.from('ia_logs').insert({
    utilizador: 'sistema',
    acao: 'analise_diaria',
    detalhes: analise
  });
}
`
);

/* ============================================================
   3️⃣ MÓDULO DE RELATÓRIOS PDF
   ============================================================ */

writeFile(
  "frontend/src/services/relatoriosService.js",
  `
import { supabase } from './supabaseClient';
import { askAI } from './aiService';

export async function gerarRelatorio(tipo) {
  const texto = await askAI("Gerar relatório em formato PDF sobre: " + tipo);

  await supabase.from('historico_eventos').insert({
    entidade: 'relatorio',
    entidade_id: Date.now(),
    acao: 'gerado',
    detalhes: tipo
  });

  return texto;
}
`
);

writeFile(
  "frontend/src/pages/modulos/relatorios.jsx",
  `
import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { gerarRelatorio } from '../../services/relatoriosService';

export default function Relatorios() {
  const [tipo, setTipo] = useState('');
  const [resultado, setResultado] = useState('');

  async function gerar() {
    const r = await gerarRelatorio(tipo);
    setResultado(r);
  }

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ marginLeft: '260px', padding: '2rem', width: '100%' }}>
        <h1>Relatórios</h1>

        <Card title="Gerar Relatório">
          <input
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            placeholder="Tipo de relatório..."
            style={{ padding: '1rem', width: '100%', marginBottom: '1rem' }}
          />
          <Button onClick={gerar}>Gerar</Button>
        </Card>

        {resultado && (
          <Card title="Resultado">
            <p>{resultado}</p>
          </Card>
        )}
      </div>
    </div>
  );
}
`
);

/* ============================================================
   4️⃣ Atualizar Router
   ============================================================ */

writeFile(
  "frontend/src/router/AppRouter.jsx",
  `
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import DashboardGestor from '../pages/gestor/Dashboard';
import DashboardPremium from '../pages/gestor/DashboardPremium';
import Intervencoes from '../pages/modulos/intervencoes';
import Obras from '../pages/modulos/obras';
import Limpezas from '../pages/modulos/limpezas';
import Financeiro from '../pages/modulos/financeiro';
import Documentos from '../pages/modulos/documentos';
import Chat from '../pages/modulos/chat';
import Relatorios from '../pages/modulos/relatorios';
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

          <Route path="/gestor/dashboard" element={<DashboardGestor />} />
          <Route path="/gestor/dashboard-premium" element={<DashboardPremium />} />

          <Route path="/modulos/intervencoes" element={<Intervencoes />} />
          <Route path="/modulos/obras" element={<Obras />} />
          <Route path="/modulos/limpezas" element={<Limpezas />} />
          <Route path="/modulos/financeiro" element={<Financeiro />} />
          <Route path="/modulos/documentos" element={<Documentos />} />
          <Route path="/modulos/chat" element={<Chat />} />
          <Route path="/modulos/relatorios" element={<Relatorios />} />

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

console.log("\\n🎯 Bloco 14 concluído com sucesso!");
console.log("Chat Interno + Tarefas Automáticas + Relatórios PDF criados automaticamente.");
