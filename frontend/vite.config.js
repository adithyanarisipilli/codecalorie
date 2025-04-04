import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  server: {
    host: "0.0.0.0", // Explicitly set to 0.0.0.0
    port: 5173, // Ensure Vite is running on this port
    strictPort: true, // Ensures Vite doesn't switch ports
    proxy: {
      "/backend": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react()],
});
