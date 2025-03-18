import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig(({ mode }) => {
  // Load environment variables based on mode (development/production)
  const env = loadEnv(mode, process.cwd(), "");

  return {
    server: {
      proxy: {
        "/backend": {
          target: env.VITE_BACKEND_URL, // Use `loadEnv` instead of `process.env`
          changeOrigin: true,
          secure: true,
        },
      },
    },
    plugins: [react()],
  };
});
