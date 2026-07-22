#!/usr/bin/env node

const { supabase } = require('../supabase/supabaseNodeClient.cjs');
const { criarInterfaceCLI, perguntar } = require('./helpers.cjs');

async function listarUtilizadores() {
  console.log('\n🔍 A obter utilizadores...\n');

  const { data, error } = await supabase.auth.admin.listUsers();

  if (error) {
    console.error('❌ Erro ao listar utilizadores:', error);
    process.exit(1);
  }

  if (!data.users || data.users.length === 0) {
    console.log('⚠️ Não existem utilizadores. Faz login primeiro no CondoManager AI.');
    process.exit(0);
  }

  console.log('📋 Lista de utilizadores:');
  data.users.forEach((u, i) => {
    console.log(`${i + 1}. ${u.email} — ID: ${u.id}`);
  });

  return data.users;
}

async function atribuirPapel(userId, role) {
  const { error } = await supabase
    .from('user_roles')
    .insert({ user_id: userId, role });

  if (error) {
    console.error('❌ Erro ao atribuir papel:', error);
    process.exit(1);
  }

  console.log(`\n🎉 Papel "${role}" atribuído com sucesso!\n`);
}

async function iniciarCLI() {
  const rl = criarInterfaceCLI();
  const users = await listarUtilizadores();

  const idx = await perguntar(rl, '\nEscolhe o número do utilizador: ');
  const user = users[parseInt(idx) - 1];

  if (!user) {
    console.log('❌ Número inválido.');
    rl.close();
    process.exit(1);
  }

  console.log('\nPapéis disponíveis:');
  console.log('1. admin');
  console.log('2. gestor');
  console.log('3. owner');
  console.log('4. viewer');

  const papelIdx = await perguntar(rl, 'Escolhe o papel: ');
  const roles = ['admin', 'gestor', 'owner', 'viewer'];
  const role = roles[parseInt(papelIdx) - 1];

  if (!role) {
    console.log('❌ Papel inválido.');
    rl.close();
    process.exit(1);
  }

  console.log(`\n🔧 A atribuir papel "${role}" ao utilizador ${user.email}...`);
  await atribuirPapel(user.id, role);

  rl.close();
}

iniciarCLI();
