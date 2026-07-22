
const { supabase } = require("../../src/supabase/supabaseNodeClient.cjs");

module.exports = function requireRole(role) {
  return async function (req, res, next) {
    const userId = req.user?.sub;

    if (!userId) {
      return res.status(401).json({ error: "Utilizador não autenticado" });
    }

    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      return res.status(500).json({ error: "Erro ao verificar role" });
    }

    if (!data || data.role !== role) {
      return res.status(403).json({ error: "Acesso negado" });
    }

    next();
  };
};
