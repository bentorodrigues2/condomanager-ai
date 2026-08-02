
import { useEffect, useState } from "react";

export default function Mensagens({ conversaId }) {
  const [lista, setLista] = useState([]);

  useEffect(() => {
    fetch("/api/chat/mensagens/" + conversaId)
      .then(r => r.json())
      .then(setLista);
  }, [conversaId]);

  return (
    <div>
      <h1>Mensagens</h1>
      <ul>
        {lista.map((m) => (
          <li key={m.id}>{m.mensagem}</li>
        ))}
      </ul>
    </div>
  );
}
