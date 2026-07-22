
const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

const requireAuth = require("../middleware/requireAuth");
const { supabase } = require("../../src/supabase/supabaseNodeClient.cjs");

// Registar dispositivo mobile
router.post("/registrar", requireAuth, async (req, res) => {
  const { expo_push_token, plataforma } = req.body;
  const user_id = req.user.id;

  const { data, error } = await supabase
    .from("dispositivos_mobile")
    .insert([{ user_id, expo_push_token, plataforma }])
    .select();

  if (error) return res.status(500).json({ error });

  res.json(data[0]);
});

// Enviar push notification
router.post("/enviar", requireAuth, async (req, res) => {
  const { user_id, titulo, mensagem } = req.body;

  const { data: dispositivos } = await supabase
    .from("dispositivos_mobile")
    .select("*")
    .eq("user_id", user_id);

  if (!dispositivos || dispositivos.length === 0)
    return res.status(404).json({ error: "Nenhum dispositivo registado." });

  for (const d of dispositivos) {
    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: d.expo_push_token,
        sound: "default",
        title: titulo,
        body: mensagem,
      }),
    });
  }

  await supabase
    .from("notificacoes_push")
    .insert([{ user_id, titulo, mensagem, enviado: true }]);

  res.json({ status: "push_enviado" });
});

module.exports = router;
