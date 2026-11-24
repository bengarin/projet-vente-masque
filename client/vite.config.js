import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// En développement, Vite (port 5173) renvoie /api et /uploads vers l'API Express (port 4000).
const API = process.env.VITE_API_PROXY || "http://localhost:4000";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: { "/api": { target: API, changeOrigin: false }, "/uploads": { target: API, changeOrigin: false } },
  },
  build: {
    outDir: "dist",
    // transforme l'imbrication CSS (styles de page) pour les navigateurs mobiles un peu anciens
    cssTarget: ["chrome100", "safari15", "firefox100", "edge100"],
  },
});
