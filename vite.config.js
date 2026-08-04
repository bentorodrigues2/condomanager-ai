import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
  // Carrega variÃ¡veis do .env.local na raiz
  const env = loadEnv(mode, path.resolve(__dirname, 'pwa'), "");

  return {
    root: path.resolve(__dirname, "pwa"), // ðŸ‘‰ forÃ§a o Vite a usar a pasta pwa
    plugins: [react()],
    base: "/",
    define: {
      "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(env.VITE_SUPABASE_URL),
      "import.meta.env.VITE_SUPABASE_KEY": JSON.stringify(env.VITE_SUPABASE_KEY),
    },
    server: {
      port: 5173,
      host: true,
    },
    build: {
      outDir: path.resolve(__dirname, "dist"),
      emptyOutDir: true,
    },
  };
});

