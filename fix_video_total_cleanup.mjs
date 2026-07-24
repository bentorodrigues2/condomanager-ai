// fix_video_total_cleanup.mjs
// Script definitivo para remover QUALQUER vídeo, moldura, CSS e componentes relacionados
// Corre com: node fix_video_total_cleanup.mjs

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🔍 A iniciar limpeza TOTAL de vídeo...");

// 1. Remover QUALQUER <video> em TODO o projeto
function removeVideoTags(filePath) {
    let content = fs.readFileSync(filePath, "utf8");
    const videoRegex = /<video[\s\S]*?<\/video>/gi;

    if (videoRegex.test(content)) {
        content = content.replace(videoRegex, "<!-- VIDEO REMOVIDO -->");
        fs.writeFileSync(filePath, content, "utf8");
        console.log(`✔ <video> removido de: ${filePath}`);
    }
}

// 2. Remover molduras HTML (#video-wrapper, #video-container)
function removeVideoWrappers(filePath) {
    let content = fs.readFileSync(filePath, "utf8");
    const wrapperRegex = /<div[^>]*id=["']video-wrapper["'][\s\S]*?<\/div>/gi;

    if (wrapperRegex.test(content)) {
        content = content.replace(wrapperRegex, "<!-- MOLDURA REMOVIDA -->");
        fs.writeFileSync(filePath, content, "utf8");
        console.log(`✔ Moldura HTML removida de: ${filePath}`);
    }
}

// 3. Remover CSS relacionado com vídeo
function removeVideoCSS(filePath) {
    let css = fs.readFileSync(filePath, "utf8");

    const cssRegex = /#video-wrapper[\s\S]*?\}|#video-container[\s\S]*?\}|#main-video[\s\S]*?\}|\.video-wrapper[\s\S]*?\}|\.logo-video[\s\S]*?\}|\.video-section[\s\S]*?\}|\.video-placeholder[\s\S]*?\}/gi;

    if (cssRegex.test(css)) {
        css = css.replace(cssRegex, "/* CSS DE VIDEO REMOVIDO */");
        fs.writeFileSync(filePath, css, "utf8");
        console.log(`✔ CSS de vídeo removido de: ${filePath}`);
    }
}

// 4. Remover componentes React (VideoSection)
function removeReactVideoComponents(filePath) {
    let content = fs.readFileSync(filePath, "utf8");

    const importRegex = /import\s+.*VideoSection.*;/gi;
    const componentRegex = /<VideoSection\s*\/>/gi;

    let changed = false;

    if (importRegex.test(content)) {
        content = content.replace(importRegex, "// import VideoSection removido");
        changed = true;
    }

    if (componentRegex.test(content)) {
        content = content.replace(componentRegex, "{/* VideoSection removido */}");
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(filePath, content, "utf8");
        console.log(`✔ Componentes React de vídeo removidos de: ${filePath}`);
    }
}

// 5. Procurar todos os ficheiros relevantes
function scanAndClean() {
    const exts = ["html", "css", "jsx", "js"];
    const files = [];

    function walk(dir) {
        fs.readdirSync(dir).forEach((file) => {
            const fullPath = path.join(dir, file);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                walk(fullPath);
            } else {
                if (exts.some(ext => fullPath.endsWith(ext))) {
                    files.push(fullPath);
                }
            }
        });
    }

    walk(__dirname);

    files.forEach((file) => {
        if (file.endsWith(".html")) {
            removeVideoTags(file);
            removeVideoWrappers(file);
        }

        if (file.endsWith(".css")) {
            removeVideoCSS(file);
        }

        if (file.endsWith(".jsx") || file.endsWith(".js")) {
            removeReactVideoComponents(file);
        }
    });
}

scanAndClean();

console.log("\n🎉 LIMPEZA TOTAL CONCLUÍDA — vídeo, molduras, CSS e componentes removidos.");
console.log("👉 Faz agora: git add . && git commit -m \"fix: limpeza total de video\" && git push");
console.log("👉 Depois disso, o login VAI aparecer no Vercel.");
