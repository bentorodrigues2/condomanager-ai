import { useEffect, useState } from "react";
import supabase from "../supabase";

export default function EmailsInbox() {
  const [emails, setEmails] = useState([]);

  useEffect(() => {
    supabase.from("emails_inbox").select("*").then(({ data }) => {
      setEmails(data);
    });
  }, []);

  return (
    <div>
      <h1>Inbox</h1>
      {emails.map(e => (
        <div key={e.id} className="email-card">
          <p><strong>De:</strong> {e.from_email}</p>
          <p><strong>Assunto:</strong> {e.subject}</p>
          <p><strong>Mensagem:</strong> {e.message}</p>
          <p><strong>Estado:</strong> {e.status}</p>
          <p><strong>Resposta:</strong> {e.reply_text}</p>
        </div>
      ))}
    </div>
  );
}
