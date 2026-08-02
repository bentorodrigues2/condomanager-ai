
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";

export default function Pagamentos() {
  const { supabase } = useAuth();
  const [lista, setLista] = useState([]);

  useEffect(() => {
    supabase
      .from("pagamentos")
      .select("*")
      .then(({ data }) => setLista(data || []));
  }, []);

  return (
    <div>
      <h1>Pagamentos</h1>

      <ul>
        {lista.map((p) => (
          <li key={p.id}>
            {p.valor}€ — {p.data} — {p.metodo} — {p.estado}
          </li>
        ))}
      </ul>
    </div>
  );
}
