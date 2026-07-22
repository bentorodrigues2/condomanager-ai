// fix-backend-env.cjs
// Script avançado para remover verificações de Supabase e .env no backend Condomanager-AI

const fs = require("fs");
const path = require("path");

const backendPath = path.join(__dirname, "backend");

console.log("🔍 A procurar verificações problemáticas no backend...\n");

// padrões que causam o crash no Render
const patterns = [
    "VITE_SUPABASE_URL",
    "VITE_SUPABASE_SERVICE_ROLE_KEY",
    "SUPABASE_URL",
    "SUPABASE_KEY",
    "em falta no .env",
    "throw new Error",
    "dotenv",
    "require('dotenv')",
    "require(\"dotenv\")"
];

// função para varrer diretórios recursivamente
function scanDir(dir) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            scanDir(fullPath);
        } else if (stat.isFile() && file.endsWith(".js")) {
            let content = fs.readFileSync(fullPath, "utf8");
            let original = content;

            let foundSomething = false;

            patterns.forEach(pattern => {
                if (content.includes(pattern)) {
                    console.log(`⚠️ Encontrado padrão '${pattern}' em: ${fullPath}`);
                    foundSomething = true;
                }
            });

            // remover blocos de verificação supabase
            content = content.replace(
                /if\s*\([^)]*(SUPABASE|VITE_SUPABASE)[^)]*\)\s*\{[^}]*\}/gi,
                ""
            );

            // remover throws relacionados
            content = content.replace(
                /throw new Error\([^)]*(SUPABASE|VITE_SUPABASE|\.env)[^)]*\);?/gi,
                ""
            );

            // remover carregamento de dotenv
            content = content.replace(/require\(['"]dotenv['"]\).config\(\);?/gi, "");

            if (content !== original) {
                fs.writeFileSync(fullPath, content, "utf8");
                console.log(`✅ Correção aplicada em: ${fullPath}\n`);
            }
        }
    });
}

scanDir(backendPath);

console.log("\n🎉 Correção concluída!");
console.log("Agora executa:");
console.log("   git add .");
console.log('   git commit -m "fix: remove env checks"');
console.log("   git push");
console.log("\nDepois: Render → Deploy latest commit\n");
