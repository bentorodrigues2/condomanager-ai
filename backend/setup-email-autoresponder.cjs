const fs = require("fs");
const path = require("path");

// ROOT
const root = process.cwd();
const routesDir = path.join(root, "routes");
const servicesDir = path.join(root, "services");
const serverFile = path.join(root, "server.js");

// Garantir pastas
if (!fs.existsSync(routesDir)) fs.mkdirSync(routesDir);
if (!fs.existsSync(servicesDir)) fs.mkdirSync(servicesDir);

// 1. Criar rota email.js
const routeContent = `
const express = require("express");
const { supabase } = require("../supabaseNodeClient.cjs");
const sendAutoReply = require("../services/sendAutoReply.js");

const router = express.Router();

router.post("/incoming", async (req, res) => {
  const { from, subject, text } = req.body;

  const { data, error } = await supabase
    .from("emails_inbox")
    .insert({
      from_email: from,
      subject,
      message: text
    })
    .select()
    .single();

  if (error) {
    console.error(error);
    return res.status(500).json({ error });
  }

  await sendAutoReply(data);

  res.json({ ok: true });
});

module.exports = router;
`;

fs.writeFileSync(path.join(routesDir, "email.js"), routeContent);

// 2. Criar serviço sendAutoReply.js
const autoReplyContent = `
const { supabase } = require("../supabaseNodeClient.cjs");
const sendEmail = require("./sendEmail.js");

module.exports = async function sendAutoReply(email) {
  const replyText = \`
Olá,

Recebemos a sua mensagem:
"\${email.subject}"

A administração irá analisar e responder com brevidade.

Cumprimentos,
CondoManager AI
\`;

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
`;

fs.writeFileSync(path.join(servicesDir, "sendAutoReply.js"), autoReplyContent);

// 3. Criar serviço sendEmail.js
const sendEmailContent = `
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async function sendEmail(to, subject, text) {
  await resend.emails.send({
    from: "CondoManager AI <no-reply@condomanager.ai>",
    to,
    subject,
    text
  });
};
`;

fs.writeFileSync(path.join(servicesDir, "sendEmail.js"), sendEmailContent);

// 4. Adicionar rota ao server.js
let serverData = fs.readFileSync(serverFile, "utf8");

if (!serverData.includes("emailRouter")) {
  serverData = serverData.replace(
    "app.use(express.json());",
    `app.use(express.json());
const emailRouter = require("./routes/email.js");
app.use("/email", emailRouter);`
  );

  fs.writeFileSync(serverFile, serverData);
}

console.log("=== AUTO RESPONDER INSTALADO COM SUCESSO ===");
