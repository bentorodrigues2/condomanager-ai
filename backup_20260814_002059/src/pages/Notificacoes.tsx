
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Notificacoes() {
  const [notificacoes, setNotificacoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data } = await supabase
        .from('notificacoes')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      setNotificacoes(data || []);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <p>A carregar notificações...</p>;

  return (
    <div>
      <h1>Notificações internas</h1>
      <p style={{ marginBottom: '1rem' }}>
        Avisos automáticos sobre incidentes, pagamentos, obras e inventário.
      </p>

      {notificacoes.length === 0 && <p>Sem notificações.</p>}

      {notificacoes.map(n => (
        <div key={n.id} style={{ padding: '0.75rem 0', borderBottom: '1px solid #eee' }}>
          <strong>{n.titulo}</strong>
          <p style={{ margin: 0 }}>{n.mensagem}</p>
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#6b7280' }}>
            {n.created_at?.slice(0, 16).replace('T', ' ')}
          </p>
        </div>
      ))}
    </div>
  );
}
