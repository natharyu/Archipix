import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/auth": "http://localhost:8089/",
      "/uploads": "http://localhost:8089/",
      "/api": "http://localhost:8089/",
      "/uploads/tmp": "http://localhost:8089/uploads/tmp/",
    },
  },
  resolve: {
    alias: {
      src: "./src",
      slices: "./src/store/slices",
      assets: "./src/assets",
    },
  },
  build: {
    watch: "./vite.config.js",
  },
  plugins: [react()],
});
