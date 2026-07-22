
const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/requireAuth");
const requireGestor = require("../middleware/requireGestor");
const { supabase } = require("../../src/supabase/supabaseNodeClient.cjs");

// Listar fornecedores
router.get("/", requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from("fornecedores")
    .select("*")
    .eq("ativo", true)
    .order("nome", { ascending: true });

  if (error) return res.status(500).json({ error });
  res.json(data);
});

// Criar fornecedor
router.post("/", requireAuth, requireGestor, async (req, res) => {
  const { nome, contacto, email, telefone, tipo } = req.body;

  const { data, error } = await supabase
    .from("fornecedores")
    .insert([{ nome, contacto, email, telefone, tipo }])
    .select();

  if (error) return res.status(500).json({ error });
  res.json(data[0]);
});

module.exports = router;
