
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";

export default function PagamentosOnline() {
  const { supabase } = useAuth();
  const [lista, setLista] = useState([]);

  useEffect(() => {
    supabase
      .from("pagamentos_online")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => setLista(data || []));
  }, []);

  return (
    <div>
      <h1>Pagamentos Online</h1>
      <ul>
        {lista.map((p) => (
          <li key={p.id}>
            {p.metodo} — {p.valor}€ — {p.estado}
          </li>
        ))}
      </ul>
    </div>
  );
}
