import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [vue()],

    // 开发服务器配置
    server: {
      port: 5173,
      open: true,

      // 代理配置
      proxy: {
        '/api': {
          target: env.VITE_PROXY_TARGET || 'http://localhost:8000',
          changeOrigin: true,
          // rewrite: (path) => path.replace(/^\/api/, ''), // 如果需要移除 /api 前缀
        },
      },
    },

    // 构建配置
    build: {
      outDir: 'dist',
      sourcemap: mode === 'development',
    },
  }
})
