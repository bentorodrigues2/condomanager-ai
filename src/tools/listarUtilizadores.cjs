
#!/usr/bin/env node

const { supabase } = require('../supabase/supabaseNodeClient.cjs');

(async () => {
  console.log("\n🔍 A listar utilizadores...\n");

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
    console.log(`${i + 1}. ${u.email} — ID: ${u.id}`);
  });

  console.log("\n🎉 Concluído!\n");
})();
