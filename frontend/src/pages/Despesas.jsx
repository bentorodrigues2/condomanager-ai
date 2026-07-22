
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";

export default function Despesas() {
  const { supabase } = useAuth();
  const [lista, setLista] = useState([]);

  useEffect(() => {
    supabase
      .from("despesas")
      .select("*")
      .then(({ data }) => setLista(data || []));
  }, []);

  return (
    <div>
      <h1>Despesas</h1>

      <ul>
        {lista.map((d) => (
          <li key={d.id}>
            {d.descricao} — {d.valor}€ — {d.data} — {d.categoria}
          </li>
        ))}
      </ul>
    </div>
  );
}
