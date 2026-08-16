import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// ✅ Configuração final para produção no Vercel
export default defineConfig({
  plugins: [react()],
  base: "./", // 👈 ESSENCIAL para que os assets JS/CSS sejam servidos corretamente
  server: {
    port: 5173,
    host: true
  },
  build: {
    outDir: "dist",
    sourcemap: false
  }
});
