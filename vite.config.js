import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",

      includeAssets: [
        "favicon.ico",
        "robots.txt",
        "apple-touch-icon.png"
      ],

      manifest: {
        name: "CondoManager AI",
        short_name: "CondoManager",
        description: "Gestão inteligente de condomínios com IA",
        theme_color: "#007bff",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        scope: "/",
        orientation: "portrait",

        icons: [
          {
            src: "/icons/icon-192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png"
          },
          {
            src: "/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable"
          }
        ]
      },

      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],

        runtimeCaching: [
          {
            urlPattern: ({ request }) =>
              request.destination === "document" ||
              request.destination === "script" ||
              request.destination === "style" ||
              request.destination === "image" ||
              request.destination === "font",

            handler: "NetworkFirst",
            options: {
              cacheName: "condomanager-cache",
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 30
              }
            }
          },

          {
            urlPattern: /^https:\/\/([a-z0-9-]+\.)?supabase\.co\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "supabase-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 7
              }
            }
          }
        ]
      }
    })
  ]
});
