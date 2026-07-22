#!/usr/bin/env node

const fs = require("fs");

console.log("\n🔧 A criar scripts CLI para CondoManager AI...\n");

// ------------------------------------------------------
// Criar helpers.cjs
// ------------------------------------------------------
const helpersPath = "src/tools/helpers.cjs";
const helpersContent = `
const readline = require('readline');

function criarInterfaceCLI() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

function perguntar(rl, pergunta) {
  return new Promise(resolve => rl.question(pergunta, resolve));
}

module.exports = { criarInterfaceCLI, perguntar };
`;

fs.writeFileSync(helpersPath, helpersContent);
console.log("📌 helpers.cjs criado.");

// ------------------------------------------------------
// Criar listarUtilizadores.cjs
// ------------------------------------------------------
const listarUsersPath = "src/tools/listarUtilizadores.cjs";
const listarUsersContent = `
#!/usr/bin/env node

const { supabase } = require('../supabase/supabaseNodeClient.cjs');

(async () => {
  console.log("\\n🔍 A listar utilizadores...\\n");

  const { data, error } = await supabase.auth.admin.listUsers();

  if (error) {
    console.error("❌ Erro ao listar utilizadores:", error);
    process.exit(1);
  }

  if (!data.users || data.users.length === 0) {
    console.log("⚠️ Não existem utilizadores.");
    process.exit(0);
  }

  data.users.forEach((u, i) => {
    console.log(\`\${i + 1}. \${u.email} — ID: \${u.id}\`);
  });

  console.log("\\n🎉 Concluído!\\n");
})();
`;

fs.writeFileSync(listarUsersPath, listarUsersContent);
console.log("📌 listarUtilizadores.cjs criado.");

// ------------------------------------------------------
// Criar listarRoles.cjs
// ------------------------------------------------------
const listarRolesPath = "src/tools/listarRoles.cjs";
const listarRolesContent = `
#!/usr/bin/env node

const { supabase } = require('../supabase/supabaseNodeClient.cjs');

(async () => {
  console.log("\\n🔍 A listar roles...\\n");

  const { data, error } = await supabase
    .from('user_roles')
    .select('*');

  if (error) {
    console.error("❌ Erro ao listar roles:", error);
    process.exit(1);
  }

  if (!data || data.length === 0) {
    console.log("⚠️ Não existem roles atribuídos.");
    process.exit(0);
  }

  data.forEach((r, i) => {
    console.log(\`\${i + 1}. User: \${r.user_id} — Role: \${r.role}\`);
  });

  console.log("\\n🎉 Concluído!\\n");
})();
`;

fs.writeFileSync(listarRolesPath, listarRolesContent);
console.log("📌 listarRoles.cjs criado.");

// ------------------------------------------------------
// Criar removerRole.cjs
// ------------------------------------------------------
const removerRolePath = "src/tools/removerRole.cjs";
const removerRoleContent = `
#!/usr/bin/env node

const { supabase } = require('../supabase/supabaseNodeClient.cjs');
const { criarInterfaceCLI, perguntar } = require('./helpers.cjs');

(async () => {
  const rl = criarInterfaceCLI();

  console.log("\\n🔍 A obter roles...\\n");

  const { data, error } = await supabase
    .from('user_roles')
    .select('*');

  if (error) {
    console.error("❌ Erro ao obter roles:", error);
    process.exit(1);
  }

  if (!data || data.length === 0) {
    console.log("⚠️ Não existem roles atribuídos.");
    process.exit(0);
  }

  data.forEach((r, i) => {
    console.log(\`\${i + 1}. User: \${r.user_id} — Role: \${r.role}\`);
  });

  const idx = await perguntar(rl, "\\nEscolhe o número do role a remover: ");
  const role = data[parseInt(idx) - 1];

  if (!role) {
    console.log("❌ Número inválido.");
    rl.close();
    process.exit(1);
  }

  console.log(\`🔧 A remover role "\${role.role}" do utilizador \${role.user_id}...\`);

  const { error: deleteError } = await supabase
    .from('user_roles')
    .delete()
    .eq('id', role.id);

  if (deleteError) {
    console.error("❌ Erro ao remover role:", deleteError);
    process.exit(1);
  }

  console.log("\\n🎉 Role removido com sucesso!\\n");
  rl.close();
})();
`;

fs.writeFileSync(removerRolePath, removerRoleContent);
console.log("📌 removerRole.cjs criado.");

// ------------------------------------------------------
// Finalização
// ------------------------------------------------------
console.log("\n🎉 Scripts CLI criados com sucesso!");
console.log("➡️ Agora podes correr qualquer um dos scripts em src/tools/");
console.log("➡️ Exemplo: node src/tools/listarUtilizadores.cjs\n");
