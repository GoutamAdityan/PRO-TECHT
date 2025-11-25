import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    allowedHosts: ["unlowered-nonintoxicatingly-leyla.ngrok-free.dev"],
  },
  preview: {
    host: true,
    port: 8080,
    allowedHosts: ["product-care-flow.onrender.com", "unlowered-nonintoxicatingly-leyla.ngrok-free.dev"], // ✅ allow Render host
    historyApiFallback: true, // Enable history API fallback for SPA routing
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    copyPublicDir: true, // Explicitly ensure public directory is copied
  },
}));
