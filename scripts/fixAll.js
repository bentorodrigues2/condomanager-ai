import fs from "fs";
import path from "path";

// Base da app Vite (frontend/src)
const baseSrc = path.resolve("frontend/src");
const assetsDir = path.join(baseSrc, "assets");
const supabaseClientPath = path.join(baseSrc, "supabaseClient.js");

// 1. Garantir pasta assets
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
  console.log("✔ Pasta assets criada em frontend/src/assets");
}

// 2. Garantir skyline.png
const skylinePath = path.join(assetsDir, "skyline.png");
if (!fs.existsSync(skylinePath)) {
  // Placeholder simples (o bundler só precisa que o ficheiro exista)
  fs.writeFileSync(skylinePath, Buffer.from(""));
  console.log("✔ Placeholder skyline.png criado em frontend/src/assets/skyline.png");
}

// 3. Garantir Logo.png
const logoPath = path.join(assetsDir, "Logo.png");
if (!fs.existsSync(logoPath)) {
  fs.writeFileSync(logoPath, Buffer.from(""));
  console.log("✔ Placeholder Logo.png criado em frontend/src/assets/Logo.png");
}

// 4. Garantir supabaseClient.js
if (!fs.existsSync(supabaseClientPath)) {
  const supabaseTemplate = `import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠ Supabase env vars em falta: VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
`;

  fs.writeFileSync(supabaseClientPath, supabaseTemplate);
  console.log("✔ supabaseClient.js criado em frontend/src/supabaseClient.js");
}

console.log("\n✅ Correções aplicadas.");
console.log("Agora executa:");
console.log("git add frontend/src/assets/skyline.png frontend/src/assets/Logo.png frontend/src/supabaseClient.js");
console.log('git commit -m "Fix unresolved imports (assets + supabaseClient)"');
console.log("git push");
