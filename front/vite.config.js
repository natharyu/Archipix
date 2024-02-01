import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/auth": "http://localhost:3000/",
      "/api": "http://localhost:3000/",
    },
  },
  resolve: {
    alias: {
      src: "./src",
      slices: "./src/store/slices",
    },
  },
  plugins: [react()],
});
