
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
