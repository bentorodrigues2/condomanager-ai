
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";

export default function Tickets() {
  const { supabase } = useAuth();
  const [lista, setLista] = useState([]);

  useEffect(() => {
    supabase
      .from("tickets_manutencao")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => setLista(data || []));
  }, []);

  return (
    <div>
      <h1>Tickets de Manutenção</h1>
      <ul>
        {lista.map((t) => (
          <li key={t.id}>
            {t.titulo} — {t.estado} — {t.prioridade}
          </li>
        ))}
      </ul>
    </div>
  );
}
