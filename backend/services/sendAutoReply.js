
const { supabase } = require("../supabase/supabaseNodeClient.cjs");
const sendEmail = require("./sendEmail.js");

module.exports = async function sendAutoReply(email) {
  const replyText = `
OlÃ¡,

Recebemos a sua mensagem:
"${email.subject}"

A administraÃ§Ã£o irÃ¡ analisar e responder com brevidade.

Cumprimentos,
CondoManager AI
`;

  await sendEmail(email.from_email, "Recebemos a sua mensagem", replyText);

  await supabase
    .from("emails_inbox")
    .update({
      auto_reply_sent: true,
      reply_text: replyText,
      status: "respondido"
    })
    .eq("id", email.id);
};

