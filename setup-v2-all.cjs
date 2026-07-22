#!/usr/bin/env node

const { execSync } = require("child_process");

console.log("\n🚀 A iniciar instalação completa da Versão 2.0 do CondoManager AI...\n");

function run(script) {
  console.log(`\n▶️ A executar: ${script}\n`);
  try {
    execSync(`node ${script}`, { stdio: "inherit" });
  } catch (err) {
    console.error(`❌ Erro ao executar ${script}:`, err);
    process.exit(1);
  }
}

// Ordem correta dos módulos
const scripts = [
  "setup-v2-operacional.cjs",
  "setup-v2-financeiro.cjs",
  "setup-v2-mobile.cjs",
  "setup-v2-ia.cjs",
  "setup-v2-chat.cjs"
];

for (const s of scripts) {
  run(s);
}

console.log("\n🎉 VERSÃO 2.0 INSTALADA COM SUCESSO!");
console.log("➡️ Todos os módulos foram instalados automaticamente.");
console.log("➡️ O sistema está pronto para testes e integração final.\n");
