
const { supabase } = require("../supabaseNodeClient.cjs");
const sendEmail = require("./sendEmail.js");

module.exports = async function sendAutoReply(email) {
  const replyText = `
Olá,

Recebemos a sua mensagem:
"${email.subject}"

A administração irá analisar e responder com brevidade.

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
