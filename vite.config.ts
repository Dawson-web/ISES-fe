import generouted from "@generouted/react-router/plugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), generouted()],
  resolve: {
    alias: {
      "@": "/src",
    },
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
  // 新增代理配置
  server: {
    proxy: {
      // 代理所有上传文件请求
      "/uploads": {
        target: `http://localhost:3000`, // Express 后端地址
        changeOrigin: true, 
        rewrite: (path) => path, // 保持原路径
      },
    },
  },
});