
const express = require("express");
const { supabase } = require("../supabase/supabaseNodeClient.cjs");
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

