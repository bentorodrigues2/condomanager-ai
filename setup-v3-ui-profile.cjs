/**
 * CondoManager AI — setup-v3-ui-profile.cjs
 * Bloco 3: Perfil, Tema, Biometria, Password, Sessão
 */

const fs = require("fs");
const path = require("path");

// Utilitário para criar ficheiros
function writeFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
  console.log("📄 Criado:", filePath);
}

// === 1. Página de Perfil ===
writeFile(
  "frontend/src/pages/Perfil.jsx",
  `
import React, { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import '../styles/theme.css';

export default function Perfil() {
  const [theme, setTheme] = useState('dark');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [biometriaAtiva, setBiometriaAtiva] = useState(false);

  // Carregar tema guardado
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  // Alternar tema
  function toggleTheme() {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  }

  // Ativar biometria
  async function ativarBiometria() {
    try {
      const cred = await navigator.credentials.create({
        publicKey: {
          challenge: new Uint8Array([1, 2, 3]),
          rp: { name: "CondoManager AI" },
          user: {
            id: new Uint8Array([1, 2, 3, 4]),
            name: "user",
            displayName: "Utilizador"
          },
          pubKeyCredParams: [{ alg: -7, type: "public-key" }],
          authenticatorSelection: { userVerification: "required" }
        }
      });

      if (cred) {
        setBiometriaAtiva(true);
        localStorage.setItem('biometria', 'true');
        alert('Biometria ativada com sucesso');
      }
    } catch (err) {
      alert('Erro ao ativar biometria');
    }
  }

  // Alterar password
  async function alterarPassword() {
    if (newPassword !== confirmPassword) {
      alert('As passwords não coincidem');
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      alert('Erro ao alterar password');
      return;
    }

    alert('Password alterada com sucesso');
  }

  // Logout
  async function terminarSessao() {
    await supabase.auth.signOut();
    window.location.href = '/login';
  }

  return (
    <div style={{ backgroundColor: 'var(--bg)', color: 'var(--text)', padding: '2rem' }}>
      <h1>Perfil</h1>

      <section style={{ marginTop: '2rem' }}>
        <h2>Preferências</h2>
        <button
          onClick={toggleTheme}
          style={{
            backgroundColor: 'var(--primary)',
            color: '#fff',
            padding: '1rem',
            borderRadius: '8px',
            border: 'none',
            marginTop: '1rem'
          }}
        >
          Alternar Tema ({theme})
        </button>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>Segurança</h2>

        <button
          onClick={ativarBiometria}
          style={{
            backgroundColor: biometriaAtiva ? '#444' : 'var(--primary)',
            color: '#fff',
            padding: '1rem',
            borderRadius: '8px',
            border: 'none',
            marginTop: '1rem'
          }}
        >
          {biometriaAtiva ? 'Biometria Ativa' : 'Ativar Biometria'}
        </button>

        <div style={{ marginTop: '2rem' }}>
          <input
            type="password"
            placeholder="Password atual"
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: '1rem', width: '100%', marginBottom: '1rem' }}
          />

          <input
            type="password"
            placeholder="Nova password"
            onChange={(e) => setNewPassword(e.target.value)}
            style={{ padding: '1rem', width: '100%', marginBottom: '1rem' }}
          />

          <input
            type="password"
            placeholder="Confirmar nova password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{ padding: '1rem', width: '100%', marginBottom: '1rem' }}
          />

          <button
            onClick={alterarPassword}
            style={{
              backgroundColor: 'var(--primary)',
              color: '#fff',
              padding: '1rem',
              borderRadius: '8px',
              border: 'none',
              width: '100%'
            }}
          >
            Alterar Password
          </button>
        </div>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>Sessão</h2>
        <button
          onClick={terminarSessao}
          style={{
            backgroundColor: '#ff4444',
            color: '#fff',
            padding: '1rem',
            borderRadius: '8px',
            border: 'none',
            width: '100%'
          }}
        >
          Terminar Sessão
        </button>
      </section>
    </div>
  );
}
`
);

// === Final ===
console.log("\\n🎯 Bloco 3 concluído com sucesso!");
console.log("Perfil, Tema, Biometria, Password e Sessão criados.");
