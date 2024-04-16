import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: true,
    port: 9001,
    proxy: {
      "/auth": "http://localhost:9000/",
      "/api": "http://localhost:9000/",
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
    outDir: "../back/views",
    watch: "./vite.config.js",
  },
  plugins: [react()],
});
