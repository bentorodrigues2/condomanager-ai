
const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/requireAuth");
const requireAdmin = require("../middleware/requireAdmin");

router.get("/admin-only", requireAuth, requireAdmin, (req, res) => {
  res.json({ message: "Bem-vindo, administrador!" });
});

module.exports = router;
