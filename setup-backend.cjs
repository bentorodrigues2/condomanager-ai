#!/usr/bin/env node

const fs = require("fs");

console.log("\n🔧 A configurar backend CondoManager AI...\n");

// Criar pasta middleware
const middlewareDir = "backend/middleware";
if (!fs.existsSync(middlewareDir)) {
  fs.mkdirSync(middlewareDir, { recursive: true });
  console.log("📁 Pasta backend/middleware criada.");
}

// Criar pasta routes
const routesDir = "backend/routes";
if (!fs.existsSync(routesDir)) {
  fs.mkdirSync(routesDir, { recursive: true });
  console.log("📁 Pasta backend/routes criada.");
}

// ------------------------------------------------------
// Middleware: requireAuth
// ------------------------------------------------------
fs.writeFileSync(
  "backend/middleware/requireAuth.js",
  `
const jwt = require("jsonwebtoken");

module.exports = function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "Token em falta" });
  }

  try {
    const decoded = jwt.decode(token);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido" });
  }
};
`
);
console.log("📌 requireAuth.js criado.");

// ------------------------------------------------------
// Middleware: requireRole
// ------------------------------------------------------
fs.writeFileSync(
  "backend/middleware/requireRole.js",
  `
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
`
);
console.log("📌 requireRole.js criado.");

// ------------------------------------------------------
// Middlewares específicos
// ------------------------------------------------------
const roles = ["admin", "gestor", "owner", "viewer"];

roles.forEach((role) => {
  fs.writeFileSync(
    `backend/middleware/require${role.charAt(0).toUpperCase() + role.slice(1)}.js`,
    `
const requireRole = require("./requireRole");
module.exports = requireRole("${role}");
`
  );
  console.log(`📌 require${role}.js criado.`);
});

// ------------------------------------------------------
// Criar rota protegida de exemplo
// ------------------------------------------------------
fs.writeFileSync(
  "backend/routes/protected.js",
  `
const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/requireAuth");
const requireAdmin = require("../middleware/requireAdmin");

router.get("/admin-only", requireAuth, requireAdmin, (req, res) => {
  res.json({ message: "Bem-vindo, administrador!" });
});

module.exports = router;
`
);
console.log("📌 Rota protegida criada.");

// ------------------------------------------------------
// Atualizar server.js para usar rotas
// ------------------------------------------------------
const serverPath = "backend/server.js";
let serverContent = fs.readFileSync(serverPath, "utf8");

if (!serverContent.includes("protected")) {
  serverContent = serverContent.replace(
    "app.use(cors());",
    `app.use(cors());
const protectedRoutes = require("./routes/protected");
app.use("/api", protectedRoutes);`
  );

  fs.writeFileSync(serverPath, serverContent);
  console.log("📌 server.js atualizado com rotas protegidas.");
}

// ------------------------------------------------------
// Finalização
// ------------------------------------------------------
console.log("\n🎉 Backend configurado com sucesso!");
console.log("➡️ Agora podes testar: GET http://localhost:3001/api/admin-only\n");
