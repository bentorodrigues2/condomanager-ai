/**
 * CondoManager AI — setup-v3-docs.cjs
 * Bloco 12: Módulo de Documentos (Upload + Preview + Histórico)
 */

const fs = require("fs");
const path = require("path");

function writeFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
  console.log("📄 Criado/Atualizado:", filePath);
}

/* ============================================================
   1. Serviço de Documentos (Supabase Storage)
   ============================================================ */

writeFile(
  "frontend/src/services/docsService.js",
  `
import { supabase } from './supabaseClient';

export async function uploadDocument(file) {
  const fileName = Date.now() + '-' + file.name;

  const { data, error } = await supabase.storage
    .from('documentos')
    .upload(fileName, file);

  if (error) return { error };

  const url = supabase.storage.from('documentos').getPublicUrl(fileName).data.publicUrl;

  await supabase.from('documentos').insert({
    nome: file.name,
    url
  });

  await supabase.from('historico_eventos').insert({
    entidade: 'documento',
    entidade_id: fileName,
    acao: 'upload',
    detalhes: file.name
  });

  return { url };
}

export async function listDocuments() {
  const { data } = await supabase.from('documentos').select('*');
  return data || [];
}
`
);

/* ============================================================
   2. Componente UploadBox
   ============================================================ */

writeFile(
  "frontend/src/components/UploadBox.jsx",
  `
import React, { useState } from 'react';
import Button from './Button';
import { uploadDocument } from '../services/docsService';

export default function UploadBox({ onUploaded }) {
  const [file, setFile] = useState(null);

  async function enviar() {
    if (!file) return;
    const result = await uploadDocument(file);
    if (!result.error) onUploaded();
  }

  return (
    <div style={{
      padding: '1rem',
      backgroundColor: 'var(--bg2)',
      borderRadius: '8px',
      marginBottom: '1rem'
    }}>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        style={{ marginBottom: '1rem' }}
      />
      <Button onClick={enviar}>Enviar Documento</Button>
    </div>
  );
}
`
);

/* ============================================================
   3. Componente DocumentList
   ============================================================ */

writeFile(
  "frontend/src/components/DocumentList.jsx",
  `
import React from 'react';

export default function DocumentList({ docs }) {
  return (
    <div style={{ marginTop: '1rem' }}>
      {docs.map((d) => (
        <div
          key={d.id}
          style={{
            padding: '1rem',
            backgroundColor: 'var(--bg2)',
            borderRadius: '8px',
            marginBottom: '1rem'
          }}
        >
          <strong>{d.nome}</strong>
          <br />
          <a href={d.url} target="_blank" rel="noreferrer">
            Abrir Documento
          </a>
        </div>
      ))}
    </div>
  );
}
`
);

/* ============================================================
   4. Página Documentos
   ============================================================ */

writeFile(
  "frontend/src/pages/modulos/documentos.jsx",
  `
import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Card from '../../components/Card';
import UploadBox from '../../components/UploadBox';
import DocumentList from '../../components/DocumentList';
import { listDocuments } from '../../services/docsService';

export default function Documentos() {
  const [docs, setDocs] = useState([]);

  async function carregar() {
    const lista = await listDocuments();
    setDocs(lista);
  }

  useEffect(() => {
    carregar();
  }, []);

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />

      <div style={{ marginLeft: '260px', padding: '2rem', width: '100%' }}>
        <h1>Documentos</h1>

        <Card title="Upload de Documentos">
          <UploadBox onUploaded={carregar} />
        </Card>

        <Card title="Lista de Documentos">
          <DocumentList docs={docs} />
        </Card>
      </div>
    </div>
  );
}
`
);

/* ============================================================
   5. Atualizar Router para incluir Documentos
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
import Documentos from '../pages/modulos/documentos';
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

          <Route
            path="/modulos/documentos"
            element={
              <ProtectedRoute allow={['gestor', 'proprietario']}>
                <Documentos />
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

console.log("\\n🎯 Bloco 12 concluído com sucesso!");
console.log("Módulo de Documentos criado automaticamente (upload + preview + histórico).");
