
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";

export default function Alertas() {
  const { supabase } = useAuth();
  const [lista, setLista] = useState([]);

  useEffect(() => {
    supabase
      .from("alertas")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => setLista(data || []));
  }, []);

  return (
    <div>
      <h1>Alertas</h1>

      <ul>
        {lista.map((a) => (
          <li key={a.id}>
            <strong>{a.titulo}</strong> — {a.mensagem}
            <br />
            <small>{a.enviado ? "Enviado" : "Pendente"}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
