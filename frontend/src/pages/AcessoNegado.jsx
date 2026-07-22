
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
