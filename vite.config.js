import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.resolve(__dirname, "pwa"), "");

  return {
    root: path.resolve(__dirname, "pwa"),
    plugins: [react()],
    base: "/",
    define: {
      "process.env": env,
    },
    server: {
      port: 5173,
      strictPort: true,
      host: true,
    },
    build: {
      outDir: path.resolve(__dirname, "dist"),
      emptyOutDir: true,
    },
  };
});
