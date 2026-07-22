
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
