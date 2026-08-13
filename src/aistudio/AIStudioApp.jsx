import React, { useState } from 'react';
import RequireAIStudio from './RequireAIStudio';
import AIStudioLayout from './AIStudioLayout';
import { askAIStudio } from './queries/smartQueries';
import '../index.css';

export default function AIStudioApp() {
  const [result, setResult] = useState(null);
  const [question, setQuestion] = useState('');

  async function handleAsk() {
    const response = await askAIStudio(question);
    setResult(response);
  }

  return (
    <RequireAIStudio>
      <AIStudioLayout>
        <div style={{ padding: '20px' }}>
          <h2>AI Studio — Dados do Condomínio</h2>
          <input
            type='text'
            placeholder='Pergunta ao AI Studio...'
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
          />
          <button onClick={handleAsk}>Perguntar</button>

          <pre style={{ marginTop: '20px' }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      </AIStudioLayout>
    </RequireAIStudio>
  );
}
