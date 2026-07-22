
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
