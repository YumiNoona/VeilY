import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    base: './',
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      'import.meta.env.GROQ_API_KEY': JSON.stringify(env.GROQ_API_KEY || ''),
      'import.meta.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || ''),
    },
  };
});
