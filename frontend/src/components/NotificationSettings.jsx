
import { useEffect, useState } from "react";
import { loadUserPreferences } from "../notifications/loadUserPreferences";
import { saveUserPreferences } from "../notifications/saveUserPreferences";
import { useAuth } from "../auth/useAuth";

export default function NotificationSettings() {
  const { user } = useAuth();
  const [prefs, setPrefs] = useState(null);

  useEffect(() => {
    loadUserPreferences(user.id).then(setPrefs);
  }, []);

  const update = async (key, value) => {
    const newPrefs = { ...prefs, [key]: value };
    setPrefs(newPrefs);
    await saveUserPreferences(user.id, newPrefs);
  };

  if (!prefs) return <p>A carregar…</p>;

  return (
    <div>
      <h2>Notificações Críticas</h2>
      <p>Ocorrências urgentes (sempre ativo)</p>
      <p>Assembleias (sempre ativo)</p>
      <p>Documentos importantes (sempre ativo)</p>

      <h2>Notificações Opcionais</h2>

      {[
        ["optional_finances", "Finanças"],
        ["optional_reservations", "Reservas"],
        ["optional_cleaning", "Limpeza"],
        ["optional_general", "Gerais"]
      ].map(([key, label]) => (
        <div key={key}>
          <label>
            {label}
            <input
              type="checkbox"
              checked={prefs[key]}
              onChange={(e) => update(key, e.target.checked)}
            />
          </label>
        </div>
      ))}
    </div>
  );
}
