import fs from "fs";
import path from "path";
import https from "https";

console.log("=== VERIFICAÇÃO COMPLETA DO PROJETO ===");

// 1. Verificar estrutura do projeto
const hasFrontend = fs.existsSync("frontend");
console.log("Frontend folder:", hasFrontend ? "✔ existe" : "❌ não existe");

const distPath = path.join("frontend", "dist");
console.log("Dist folder:", fs.existsSync(distPath) ? "✔ existe" : "❌ não existe");

// 2. Verificar ficheiro index.html do Vite
const indexHtml = path.join(distPath, "index.html");
console.log("index.html:", fs.existsSync(indexHtml) ? "✔ existe" : "❌ não existe");

// 3. Verificar ficheiros JS do Vite
const assetsPath = path.join(distPath, "assets");
console.log("assets folder:", fs.existsSync(assetsPath) ? "✔ existe" : "❌ não existe");

// 4. Verificar variável de ambiente do vídeo
const videoEnv = process.env.VITE_HERO_VIDEO_URL;
console.log("VITE_HERO_VIDEO_URL:", videoEnv ? "✔ definida" : "❌ não definida");

// 5. Verificar acessibilidade do vídeo
if (videoEnv) {
    https.get(videoEnv, res => {
        console.log("Vídeo acessível:", res.statusCode === 200 ? "✔ sim" : "❌ não");
        console.log("MIME type:", res.headers["content-type"]);
    }).on("error", err => {
        console.log("❌ Erro ao aceder ao vídeo:", err.message);
    });
}

// 6. Verificar se o Vercel está a servir HTML em vez de JS
const vercelHtmlServed = fs.existsSync("index.html");
console.log("Vercel root index.html:", vercelHtmlServed ? "❌ Vercel está a servir a raiz" : "✔ OK");

console.log("=== FIM ===");
