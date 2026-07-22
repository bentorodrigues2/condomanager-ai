/**
 * CondoManager AI — setup-v3-build.cjs
 * Bloco 18: Build Final + Testes + Checklist de Produção
 */

const fs = require("fs");
const path = require("path");

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("📄 Criado/Atualizado:", file);
}

/* ============================================================
   1️⃣ Script de Build
   ============================================================ */

write(
  "frontend/SCRIPTS_BUILD.txt",
  `
# Build final da aplicação
npm install
npm run build

# A pasta final será:
dist/
`
);

/* ============================================================
   2️⃣ Script de Testes Básicos
   ============================================================ */

write(
  "frontend/tests/basic-tests.txt",
  `
TESTES BÁSICOS ANTES DO DEPLOY:

1. LOGIN
   - Testar login com gestor, proprietário e fornecedor.

2. ROTAS PROTEGIDAS
   - Gestor deve aceder a tudo.
   - Proprietário NÃO deve aceder a obras.
   - Fornecedor NÃO deve aceder ao financeiro.

3. PWA
   - Abrir no Chrome → DevTools → Application → Manifest
   - Verificar se aparece "Install".

4. IA
   - Abrir /assistente-ia
   - Enviar um prompt simples.

5. CHAT
   - Abrir /modulos/chat
   - Enviar mensagem e ver realtime.

6. DOCUMENTOS
   - Upload de PDF
   - Abrir link público

7. DASHBOARD PREMIUM
   - Verificar gráficos carregados

8. EXPORTAÇÕES
   - Exportar CSV e verificar conteúdo

9. AUDITORIA
   - Verificar se ações aparecem na tabela auditoria
`
);

/* ============================================================
   3️⃣ Checklist de Produção
   ============================================================ */

write(
  "frontend/CHECKLIST_PRODUCAO.txt",
  `
CHECKLIST FINAL DE PRODUÇÃO:

✔ Build concluído (dist/)
✔ PWA funcional
✔ Service Worker registado
✔ Manifest válido
✔ Icons incluídos
✔ Rotas protegidas
✔ IA funcional
✔ Chat realtime
✔ Documentos OK
✔ Auditoria OK
✔ Exportações OK
✔ Sem erros no console
✔ Sem warnings no build
✔ Deploy pronto
`
);

/* ============================================================
   4️⃣ Script de Verificação de PWA
   ============================================================ */

write(
  "frontend/scripts/verificar-pwa.txt",
  `
PASSOS PARA VERIFICAR PWA:

1. Abrir localhost:5173
2. Chrome DevTools → Application
3. Verificar:
   - Manifest OK
   - Service Worker ativo
   - "Install App" disponível
4. Desligar Wi-Fi
5. Recarregar → App deve abrir offline
`
);

/* ============================================================
   FINAL
   ============================================================ */

console.log("\\n🎯 Bloco 18 concluído com sucesso!");
console.log("Build final, testes e checklist de produção criados automaticamente.");
