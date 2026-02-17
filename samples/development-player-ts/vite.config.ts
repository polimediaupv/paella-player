import { defineConfig, searchForWorkspaceRoot } from 'vite'

export default defineConfig({
  build: {
    sourcemap: true,
    minify: false,
  },
  css: {
    devSourcemap: true,
  },
  server: {
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
    ],
    // CRITICAL para Safari: incluir source maps en otras dependencies de node_modules
    esbuildOptions: {
      sourcemap: true,
    },
  },
})
