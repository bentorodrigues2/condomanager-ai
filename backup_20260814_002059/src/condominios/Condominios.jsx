import React, { useEffect, useState } from 'react';
import { getCondominios, setCondominioAtual, getCondominioAtual } from './condominiosService';

export default function Condominios() {
  const [lista, setLista] = useState([]);
  const [selecionado, setSelecionado] = useState(getCondominioAtual());

  useEffect(() => {
    getCondominios().then(setLista);
  }, []);

  function selecionar(id) {
    setCondominioAtual(id);
    setSelecionado(id);
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Condomínios</h1>

      {lista.length === 0 && <p>A carregar condomínios...</p>}

      <ul>
        {lista.map((c) => (
          <li key={c.id} style={{ marginBottom: 10 }}>
            <button
              onClick={() => selecionar(c.id)}
              style={{
                padding: 10,
                background: selecionado == c.id ? '#007bff' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer'
              }}
            >
              {c.nome} — {c.morada}
            </button>
          </li>
        ))}
      </ul>

      {selecionado && (
        <div style={{ marginTop: 20 }}>
          <h3>Condomínio selecionado:</h3>
          <p>ID: {selecionado}</p>
        </div>
      )}
    </div>
  );
}
