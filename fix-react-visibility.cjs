// fix-react-visibility.cjs
// Script para garantir que o React renderiza algo visível no Vercel

const fs = require("fs");
const path = require("path");

const frontend = path.join(__dirname, "frontend");
const src = path.join(frontend, "src");
const publicDir = path.join(frontend, "public");

// 1️⃣ Garantir index.html funcional
const indexHtml = `
<!DOCTYPE html>
<html lang="pt">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CondoManager AI</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;

fs.mkdirSync(publicDir, { recursive: true });
fs.writeFileSync(path.join(publicDir, "index.html"), indexHtml);
console.log("✅ index.html corrigido");

// 2️⃣ Garantir main.tsx funcional
const mainTsx = `
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`;

fs.writeFileSync(path.join(src, "main.tsx"), mainTsx);
console.log("✅ main.tsx corrigido");

// 3️⃣ Criar App.jsx visível
const appJsx = `
import React from "react";

export default function App() {
  return (
    <div style={{
      fontFamily: "Arial",
      padding: "40px",
      textAlign: "center",
      fontSize: "32px",
      color: "#333"
    }}>
      <h1>CondoManager AI</h1>
      <p>Frontend está a funcionar ✔️</p>
    </div>
  );
}
`;

fs.writeFileSync(path.join(src, "App.jsx"), appJsx);
console.log("✅ App.jsx corrigido");

// 4️⃣ Garantir vite.config.js funcional
const viteConfig = `
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "",
  plugins: [react()],
  build: {
    outDir: "dist"
  }
});
`;

fs.writeFileSync(path.join(frontend, "vite.config.js"), viteConfig);
console.log("✅ vite.config.js corrigido");

console.log("\n🎉 Correção concluída!");
console.log("Agora executa:");
console.log("   git add .");
console.log('   git commit -m "fix: react visibility"');
console.log("   git push");
console.log("\nDepois abre: https://bentorodrigues2.vercel.app\n");
