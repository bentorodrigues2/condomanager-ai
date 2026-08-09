import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/",
  build: {
    copyPublicDir: true,
    outDir: "dist",
    emptyOutDir: true
  }
});
