const fs = require("fs");
const path = require("path");

function createFile(file, content) {
    fs.writeFileSync(file, content);
    console.log("Created:", file);
}

const root = __dirname;
const supabaseDir = path.join(root, "supabase-policies");

if (!fs.existsSync(supabaseDir)) {
    fs.mkdirSync(supabaseDir, { recursive: true });
    console.log("Created:", supabaseDir);
}

// POLICIES SQL
const policiesSqlPath = path.join(supabaseDir, "rls-policies.sql");

createFile(
    policiesSqlPath,
    `
-- RLS BASE: ativar RLS nas tabelas principais
alter table condominios enable row level security;
alter table fracoes enable row level security;
alter table condominos enable row level security;
alter table pagamentos enable row level security;
alter table incidencias enable row level security;

-- Exemplo: condómino só vê dados da sua fração
create policy "condomino_view_own_frac" on fracoes
    for select
    using (auth.uid() = (select id from condominos where condominos.fracao_id = fracoes.id));

-- Exemplo: condómino só vê os seus pagamentos
create policy "condomino_view_own_payments" on pagamentos
    for select
    using (auth.uid() = (select id from condominos where condominos.fracao_id = pagamentos.fracao_id));

-- Exemplo: gestor vê tudo
create policy "gestor_view_all" on condominios
    for select
    using (auth.role() = 'gestor');

-- Exemplo: admin vê tudo
create policy "admin_view_all" on condominios
    for select
    using (auth.role() = 'admin');
`
);

// README rápido
const readmePath = path.join(supabaseDir, "README-RLS.txt");

createFile(
    readmePath,
    `
1) Abre o Supabase.
2) Vai a SQL Editor.
3) Cola o conteúdo de rls-policies.sql.
4) Corre o script.
5) RLS fica ativo com regras base para:
   - condóminos
   - gestores
   - admin

Depois disso, o CondoManager AI passa a respeitar:
   - quem vê o quê
   - por fração
   - por papel (role)
`
);

console.log("MODULE 7 COMPLETED");
console.log("Ficheiros de RLS criados em supabase-policies/. Cola o SQL no Supabase e corre.");
