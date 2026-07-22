#!/usr/bin/env node

const { supabase } = require("./src/supabase/supabaseNodeClient.cjs");

console.log("\n🔧 Iniciando configuração Supabase para CondoManager AI...\n");

// ------------------------------------------------------
// 1. Criar tabela user_roles (se não existir)
// ------------------------------------------------------
async function criarTabelaUserRoles() {
  console.log("📌 A criar tabela user_roles (se não existir)...");

  const sql = `
    create table if not exists user_roles (
      id uuid default gen_random_uuid() primary key,
      user_id uuid not null,
      role text not null,
      created_at timestamp default now()
    );
  `;

  const { error } = await supabase.rpc("execute_sql", { sql });

  if (error) {
    console.error("❌ Erro ao criar tabela user_roles:", error);
    process.exit(1);
  }

  console.log("✅ Tabela user_roles pronta.\n");
}

// ------------------------------------------------------
// 2. Ativar RLS
// ------------------------------------------------------
async function ativarRLS() {
  console.log("📌 A ativar RLS na tabela user_roles...");

  const sql = `
    alter table user_roles enable row level security;
  `;

  const { error } = await supabase.rpc("execute_sql", { sql });

  if (error) {
    console.error("❌ Erro ao ativar RLS:", error);
    process.exit(1);
  }

  console.log("✅ RLS ativado.\n");
}

// ------------------------------------------------------
// 3. Criar função SQL para verificar roles
// ------------------------------------------------------
async function criarFuncaoCheckRole() {
  console.log("📌 A criar função check_role()...");

  const sql = `
    create or replace function check_role(required_role text)
    returns boolean
    language sql
    security definer
    as $$
      select exists (
        select 1
        from user_roles
        where user_id = auth.uid()
        and role = required_role
      );
    $$;
  `;

  const { error } = await supabase.rpc("execute_sql", { sql });

  if (error) {
    console.error("❌ Erro ao criar função check_role:", error);
    process.exit(1);
  }

  console.log("✅ Função check_role criada.\n");
}

// ------------------------------------------------------
// 4. Criar políticas RLS base
// ------------------------------------------------------
async function criarPolicies() {
  console.log("📌 A criar políticas RLS...");

  const sql = `
    drop policy if exists "admins podem tudo" on user_roles;
    drop policy if exists "gestores podem ler" on user_roles;
    drop policy if exists "owners só veem o próprio" on user_roles;
    drop policy if exists "viewer só lê" on user_roles;

    create policy "admins podem tudo"
      on user_roles
      for all
      using ( check_role('admin') );

    create policy "gestores podem ler"
      on user_roles
      for select
      using ( check_role('gestor') );

    create policy "owners só veem o próprio"
      on user_roles
      for select
      using ( auth.uid() = user_id );

    create policy "viewer só lê"
      on user_roles
      for select
      using ( check_role('viewer') );
  `;

  const { error } = await supabase.rpc("execute_sql", { sql });

  if (error) {
    console.error("❌ Erro ao criar políticas RLS:", error);
    process.exit(1);
  }

  console.log("✅ Políticas RLS criadas.\n");
}

// ------------------------------------------------------
// EXECUÇÃO
// ------------------------------------------------------
(async () => {
  await criarTabelaUserRoles();
  await ativarRLS();
  await criarFuncaoCheckRole();
  await criarPolicies();

  console.log("\n🎉 Supabase configurado com sucesso!");
  console.log("➡️ Agora corre: node setup-cli.cjs\n");
})();
