
import { useEffect, useState } from "react";

export default function Conversas() {
  const [lista, setLista] = useState([]);

  useEffect(() => {
    fetch("/api/chat/conversas")
      .then(r => r.json())
      .then(setLista);
  }, []);

  return (
    <div>
      <h1>Conversas</h1>
      <ul>
        {lista.map((c) => (
          <li key={c.id}>{c.nome || "Conversa Privada"}</li>
        ))}
      </ul>
    </div>
  );
}
