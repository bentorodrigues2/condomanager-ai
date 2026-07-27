
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
