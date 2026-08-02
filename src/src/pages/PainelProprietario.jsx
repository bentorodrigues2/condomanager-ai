
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";

export default function PainelProprietario() {
  const { supabase, user } = useAuth();
  const [dados, setDados] = useState(null);

  useEffect(() => {
    if (!user) return;

    supabase
      .from("proprietarios")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(async ({ data }) => {
        if (!data) return;
        const resp = await fetch("/api/proprietario/painel/" + data.id);
        const json = await resp.json();
        setDados(json);
      });
  }, [user]);

  if (!dados) return <div>A carregar...</div>;

  return (
    <div>
      <h1>Painel do Proprietário</h1>

      <h2>As suas Frações</h2>
      <ul>
        {dados.fracoes.map(f => (
          <li key={f.id}>{f.codigo}</li>
        ))}
      </ul>

      <h2>Quotas</h2>
      <ul>
        {dados.quotas.map(q => (
          <li key={q.id}>{q.periodo} — {q.valor}€ — {q.estado}</li>
        ))}
      </ul>

      <h2>Cobranças</h2>
      <ul>
        {dados.cobrancas.map(c => (
          <li key={c.id}>{c.periodo} — {c.valor}€ — {c.estado}</li>
        ))}
      </ul>

      <h2>Pagamentos</h2>
      <ul>
        {dados.pagamentos.map(p => (
          <li key={p.id}>{p.data} — {p.valor}€</li>
        ))}
      </ul>

      <h2>Documentos</h2>
      <ul>
        {dados.documentos.map(d => (
          <li key={d.id}>{d.nome}</li>
        ))}
      </ul>

      <h2>Notificações</h2>
      <ul>
        {dados.notificacoes.map(n => (
          <li key={n.id}>{n.titulo} — {n.mensagem}</li>
        ))}
      </ul>

      <h2>Alertas</h2>
      <ul>
        {dados.alertas.map(a => (
          <li key={a.id}>{a.titulo} — {a.mensagem}</li>
        ))}
      </ul>
    </div>
  );
}
