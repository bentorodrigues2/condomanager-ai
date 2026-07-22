
#!/usr/bin/env node

const { supabase } = require('../supabase/supabaseNodeClient.cjs');
const { criarInterfaceCLI, perguntar } = require('./helpers.cjs');

(async () => {
  const rl = criarInterfaceCLI();

  console.log("\n🔍 A obter roles...\n");

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
    console.log(`${i + 1}. User: ${r.user_id} — Role: ${r.role}`);
  });

  const idx = await perguntar(rl, "\nEscolhe o número do role a remover: ");
  const role = data[parseInt(idx) - 1];

  if (!role) {
    console.log("❌ Número inválido.");
    rl.close();
    process.exit(1);
  }

  console.log(`🔧 A remover role "${role.role}" do utilizador ${role.user_id}...`);

  const { error: deleteError } = await supabase
    .from('user_roles')
    .delete()
    .eq('id', role.id);

  if (deleteError) {
    console.error("❌ Erro ao remover role:", deleteError);
    process.exit(1);
  }

  console.log("\n🎉 Role removido com sucesso!\n");
  rl.close();
})();
