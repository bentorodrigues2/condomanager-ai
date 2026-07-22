
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";

export default function Reconciliacao() {
  const { supabase } = useAuth();
  const [lista, setLista] = useState([]);

  useEffect(() => {
    supabase
      .from("reconciliacao_financeira")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => setLista(data || []));
  }, []);

  return (
    <div>
      <h1>Reconciliacao Financeira</h1>
      <ul>
        {lista.map((r) => (
          <li key={r.id}>
            {r.metodo} — {r.valor}€ — {r.estado}
          </li>
        ))}
      </ul>
    </div>
  );
}
