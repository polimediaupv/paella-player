import { defineConfig, searchForWorkspaceRoot } from 'vite'

// read from env variables if available, otherwise use default values
const AI_PROXY_URL = process.env.AI_PROXY_URL || 'https://api.opanai.com'
const AI_PROXY_KEY = process.env.AI_PROXY_KEY || 'dummy'

export default defineConfig({
  build: {
    sourcemap: true,
    minify: false,
  },
  css: {
    devSourcemap: true,
  },
  server: {
     proxy: {
      '/ai-proxy/v1': {
        target: AI_PROXY_URL,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ai-proxy\/v1/, ''),
        configure: (proxy) => {
        proxy.on('proxyReq', (proxyReq) => {
          proxyReq.removeHeader('Authorization');
          proxyReq.setHeader('Authorization', 'Bearer ' + AI_PROXY_KEY);
        });
      }
      }
    },
    sourcemapIgnoreList: () => false,
    fs: {
      allow: [
        // search up for workspace root
        searchForWorkspaceRoot(process.cwd()),
        // your custom rules
        '../../repos/',
      ],
    },
  },
  optimizeDeps: {
    // Excluir dependencias locales del monorepo para usar sus source maps directamente
    exclude: [
      '@asicupv/paella-core',
      '@asicupv/paella-basic-plugins',
      '@asicupv/paella-slide-plugins',
      '@asicupv/paella-video-plugins',
      '@asicupv/paella-webgl-plugins',
      '@asicupv/paella-extra-plugins',
      '@asicupv/paella-ai-plugins',
      '@asicupv/paella-user-tracking',
      '@asicupv/paella-zoom-plugin',
    ]
  }
})
