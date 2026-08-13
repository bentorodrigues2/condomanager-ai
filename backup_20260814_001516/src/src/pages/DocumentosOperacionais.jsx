
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";

export default function DocumentosOperacionais() {
  const { supabase } = useAuth();
  const [lista, setLista] = useState([]);

  useEffect(() => {
    supabase
      .from("documentos_operacionais")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => setLista(data || []));
  }, []);

  return (
    <div>
      <h1>Documentos Operacionais</h1>
      <ul>
        {lista.map((d) => (
          <li key={d.id}>
            {d.tipo} — {d.nome}
          </li>
        ))}
      </ul>
    </div>
  );
}
