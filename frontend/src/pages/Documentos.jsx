
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";

export default function Documentos() {
  const { supabase } = useAuth();
  const [lista, setLista] = useState([]);

  useEffect(() => {
    supabase
      .from("documentos")
      .select("*")
      .then(({ data }) => setLista(data || []));
  }, []);

  return (
    <div>
      <h1>Documentos</h1>

      <ul>
        {lista.map((d) => (
          <li key={d.id}>
            <strong>{d.nome}</strong> — {d.tipo}
            <br />
            <a href={d.url} target="_blank">Abrir documento</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
