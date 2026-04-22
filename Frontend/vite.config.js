import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],

  optimizeDeps: {
    exclude: [],
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  server: {
    port: 5173,
    hmr: {
      overlay: false, // ← Disables the big red error overlay
    },
    proxy: {
      "/api": {
        target: "http://localhost:5005",
        changeOrigin: true,
      },
      "/api/v1": {
        target: "http://localhost:5005",
        changeOrigin: true,
      },
    },
  },
});
