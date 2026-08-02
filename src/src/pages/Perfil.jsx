
import React from 'react';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import '../styles/theme.css';

export default function Perfil() {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />

      <div style={{ marginLeft: '260px', padding: '2rem', width: '100%' }}>
        <h1>Perfil</h1>

        <Card title="Preferências">
          <p>Gestão de tema, biometria e sessão já configurados.</p>
        </Card>
      </div>
    </div>
  );
}
