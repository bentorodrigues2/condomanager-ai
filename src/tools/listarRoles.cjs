
#!/usr/bin/env node

const { supabase } = require('../supabase/supabaseNodeClient.cjs');

(async () => {
  console.log("\n🔍 A listar roles...\n");

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
    console.log(`${i + 1}. User: ${r.user_id} — Role: ${r.role}`);
  });

  console.log("\n🎉 Concluído!\n");
})();
