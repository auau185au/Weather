import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // 代理高德地图 API 请求（解决 CORS 和本地开发问题）
      '/api-amap': {
        target: 'https://restapi.amap.com',
        changeOrigin: true,
        // 如果请求路径带了 /api-amap 前缀，需要去掉后再转发到 target
        rewrite: (path) => path.replace(/^\/api-amap/, ''),
      },
    },
  },
});