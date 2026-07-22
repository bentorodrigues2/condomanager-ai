
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";

export default function Notificacoes() {
  const { supabase } = useAuth();
  const [lista, setLista] = useState([]);

  useEffect(() => {
    supabase
      .from("notificacoes")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => setLista(data || []));
  }, []);

  return (
    <div>
      <h1>Notificações</h1>

      <ul>
        {lista.map((n) => (
          <li key={n.id}>
            <strong>{n.titulo}</strong> — {n.mensagem}
            <br />
            <small>{n.lida ? "Lida" : "Por ler"}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
