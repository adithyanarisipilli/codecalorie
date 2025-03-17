import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

export default defineConfig({
  server: {
    proxy: {
      "/backend": {
        target: process.env.VITE_BACKEND_URL, // Use environment variable
        changeOrigin: true,
        secure: true, // Since it's HTTPS
      },
    },
  },
  plugins: [react()],
});
