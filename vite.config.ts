import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
  base: "/annotation-editor/",
  build: {
    outDir: "../portfolio/public/annotation-editor",
  },
  plugins: [react(), tailwindcss()],
})
