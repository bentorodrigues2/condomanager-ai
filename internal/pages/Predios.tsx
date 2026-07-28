
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Predios() {
  const [predios, setPredios] = useState<any[]>([]);
  const [fracoes, setFracoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [p, f] = await Promise.all([
        supabase.from('predios').select('*'),
        supabase.from('fracoes').select('*')
      ]);
      setPredios(p.data || []);
      setFracoes(f.data || []);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <p>A carregar prédios e frações...</p>;

  return (
    <div>
      <h1>Prédios & Frações</h1>
      <p style={{ marginBottom: '1rem' }}>
        Estrutura física do condomínio: blocos, entradas e frações.
      </p>

      <h2>Prédios</h2>
      {predios.length === 0 && <p>Nenhum prédio registado.</p>}
      {predios.map(p => (
        <div key={p.id} style={{ padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
          <strong>{p.nome}</strong> — {p.morada}
        </div>
      ))}

      <h2 style={{ marginTop: '2rem' }}>Frações</h2>
      {fracoes.length === 0 && <p>Nenhuma fração registada.</p>}
      {fracoes.map(f => (
        <div key={f.id} style={{ padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
          <strong>{f.codigo}</strong> — {f.tipologia} — proprietário #{f.owner_id}
        </div>
      ))}
    </div>
  );
}
