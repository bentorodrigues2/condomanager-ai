#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');

console.log("\n🚀 Iniciando setup da estrutura do projeto CondoManager AI...\n");

// ------------------------------------------------------
// Função para apagar pastas
// ------------------------------------------------------
function limparPasta(path) {
  if (fs.existsSync(path)) {
    console.log(`🗑️  A apagar pasta existente: ${path}`);
    fs.rmSync(path, { recursive: true, force: true });
  }
}

// ------------------------------------------------------
// Função para criar pastas
// ------------------------------------------------------
function criarPasta(path) {
  console.log(`📁 A criar pasta: ${path}`);
  fs.mkdirSync(path, { recursive: true });
}

// ------------------------------------------------------
// 1. Limpar backend e frontend
// ------------------------------------------------------
limparPasta("backend");
limparPasta("frontend");

// ------------------------------------------------------
// 2. Criar estrutura base
// ------------------------------------------------------
criarPasta("backend");
criarPasta("frontend");
criarPasta("src/tools");
criarPasta("src/supabase");

// ------------------------------------------------------
// 3. Criar backend Express
// ------------------------------------------------------
console.log("\n⚙️  A configurar backend Express...\n");

execSync("npm init -y", { stdio: "inherit", cwd: "backend" });
execSync("npm install express cors dotenv", { stdio: "inherit", cwd: "backend" });

fs.writeFileSync("backend/server.js",
`require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: "Backend CondoManager AI ativo" });
});

app.listen(3001, () => {
  console.log("🚀 Backend a correr na porta 3001");
});
`);

console.log("✅ Backend Express criado com sucesso!\n");

// ------------------------------------------------------
// 4. Criar frontend React + Vite
// ------------------------------------------------------
console.log("⚙️  A configurar frontend React + Vite...\n");

execSync("npm create vite@latest frontend -- --template react", { stdio: "inherit" });
execSync("npm install", { stdio: "inherit", cwd: "frontend" });

console.log("✅ Frontend React + Vite criado com sucesso!\n");

// ------------------------------------------------------
// 5. Criar ficheiro supabaseNodeClient
// ------------------------------------------------------
fs.writeFileSync("src/supabase/supabaseNodeClient.cjs",
`require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Erro: VITE_SUPABASE_URL ou VITE_SUPABASE_SERVICE_ROLE_KEY em falta no .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = { supabase };
`);

console.log("📌 Cliente Supabase criado em src/supabase/supabaseNodeClient.cjs");

// ------------------------------------------------------
// 6. Finalização
// ------------------------------------------------------
console.log("\n🎉 Estrutura do projeto criada com sucesso!");
console.log("➡️ Agora corre: node setup-supabase.cjs\n");
