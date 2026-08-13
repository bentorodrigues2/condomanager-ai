import { useEffect, useState } from "react";
import supabase from "../supabase";

export default function EmailsHistory() {
  const [emails, setEmails] = useState([]);

  const userEmail = localStorage.getItem("session_email");

  useEffect(() => {
    supabase
      .from("emails_inbox")
      .select("*")
      .eq("from_email", userEmail)
      .then(({ data }) => setEmails(data));
  }, []);

  return (
    <div>
      <h1>Mensagens</h1>
      {emails.map(e => (
        <div key={e.id} className="email-card">
          <p><strong>Assunto:</strong> {e.subject}</p>
          <p><strong>Mensagem:</strong> {e.message}</p>
          <p><strong>Resposta:</strong> {e.reply_text}</p>
        </div>
      ))}
    </div>
  );
}
