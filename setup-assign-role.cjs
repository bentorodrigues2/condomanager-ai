const fs = require('fs');
const path = require('path');

console.log('🔧 A criar ferramenta automática para atribuir roles...');

const filePath = path.join(__dirname, 'src/tools/assignRole.ts');

const newContent = `
import { supabase } from '../supabaseClient';

/**
 * Lista todos os utilizadores do Supabase
 */
export async function listarUtilizadores() {
  const { data, error } = await supabase.auth.admin.listUsers();
  if (error) {
    console.error('Erro ao listar utilizadores:', error);
    return [];
  }
  return data.users;
}

/**
 * Atribui um papel ao utilizador
 */
export async function atribuirRole(userId, role) {
  const { error } = await supabase
    .from('user_roles')
    .insert({ user_id: userId, role });

  if (error) {
    console.error('Erro ao atribuir role:', error);
    return false;
  }

  return true;
}

/**
 * Ferramenta CLI para atribuir roles
 */
export async function iniciarCLI() {
  console.log('🔍 A obter utilizadores...');

  const users = await listarUtilizadores();

  if (users.length === 0) {
    console.log('⚠️ Não existem utilizadores. Faz login primeiro no CondoManager AI.');
    return;
  }

  console.log('\\n📋 Lista de utilizadores:');
  users.forEach((u, i) => {
    console.log(\`\${i + 1}. \${u.email} — ID: \${u.id}\`);
  });

  const prompt = require('prompt-sync')({ sigint: true });

  const index = parseInt(prompt('\\nEscolhe o número do utilizador: '), 10) - 1;

  if (index < 0 || index >= users.length) {
    console.log('❌ Número inválido.');
    return;
  }

  const user = users[index];

  console.log('\\nPapéis disponíveis:');
  console.log('1. admin');
  console.log('2. gestor');
  console.log('3. owner');
  console.log('4. viewer');

  const roleIndex = parseInt(prompt('Escolhe o papel: '), 10);

  const roles = ['admin', 'gestor', 'owner', 'viewer'];

  if (!roles[roleIndex - 1]) {
    console.log('❌ Papel inválido.');
    return;
  }

  const role = roles[roleIndex - 1];

  console.log(\`\\n🔧 A atribuir papel "\${role}" ao utilizador \${user.email}...\`);

  const ok = await atribuirRole(user.id, role);

  if (ok) {
    console.log('🎉 Papel atribuído com sucesso!');
  } else {
    console.log('❌ Falha ao atribuir papel.');
  }
}

iniciarCLI();
`;

fs.mkdirSync(path.join(__dirname, 'src/tools'), { recursive: true });
fs.writeFileSync(filePath, newContent, 'utf8');

console.log('🎉 Ferramenta automática criada: src/tools/assignRole.ts');
console.log('👉 Usa: node assign-role.cjs (ver instruções abaixo)');
