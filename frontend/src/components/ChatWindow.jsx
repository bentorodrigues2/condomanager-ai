
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
