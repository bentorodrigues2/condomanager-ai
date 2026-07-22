// fix-backend-supabase.cjs
// Script para remover verificações Supabase do backend Condomanager-AI

const fs = require("fs");
const path = require("path");

// Caminho para o backend
const backendPath = path.join(__dirname, "backend");

// Ficheiros onde a verificação pode existir
const possibleFiles = [
    "server.js",
    "config.js",
    "supabase.js",
    "utils/env.js",
    "utils/config.js",
    "index.js"
];

const supabasePatterns = [
    "VITE_SUPABASE_URL",
    "VITE_SUPABASE_SERVICE_ROLE_KEY",
    "em falta no .env",
    "Supabase",
    "supabase"
];

console.log("🔍 A procurar verificações Supabase no backend...");

let found = false;

possibleFiles.forEach(file => {
    const fullPath = path.join(backendPath, file);

    if (fs.existsSync(fullPath)) {
        let content = fs.readFileSync(fullPath, "utf8");

        supabasePatterns.forEach(pattern => {
            if (content.includes(pattern)) {
                console.log(`⚠️ Encontrado código Supabase em: ${file}`);

                // Remove blocos de verificação Supabase
                content = content.replace(
                    /if\s*\([^)]*VITE_SUPABASE_URL[^)]*\)\s*\{[^}]*\}/g,
                    ""
                );

                content = content.replace(
                    /if\s*\([^)]*VITE_SUPABASE_SERVICE_ROLE_KEY[^)]*\)\s*\{[^}]*\}/g,
                    ""
                );

                // Remove qualquer throw relacionado
                content = content.replace(
                    /throw new Error\([^)]*Supabase[^)]*\);?/g,
                    ""
                );

                content = content.replace(
                    /throw new Error\([^)]*VITE_SUPABASE[^)]*\);?/g,
                    ""
                );

                fs.writeFileSync(fullPath, content, "utf8");

                console.log(`✅ Correção aplicada em: ${file}`);
                found = true;
            }
        });
    }
});

if (!found) {
    console.log("✔ Nenhuma verificação Supabase encontrada. Nada a corrigir.");
} else {
    console.log("🎉 Correção concluída! Agora faz:");
    console.log("   git add .");
    console.log('   git commit -m "fix: remove supabase checks"');
    console.log("   git push");
    console.log("Depois: Render → Deploy latest commit");
}
