import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// For GitHub Pages at https://raykl640.github.io/<repo>/ set BASE_PATH=/<repo>/
export default defineConfig({
  base: process.env.BASE_PATH ?? "/",
  plugins: [react(), tailwindcss()],
  // three.js lives in a lazily-loaded chunk (the turntable), so a larger limit is fine
  build: { chunkSizeWarningLimit: 600 },
});
