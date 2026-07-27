
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
