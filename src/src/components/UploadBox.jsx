
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
