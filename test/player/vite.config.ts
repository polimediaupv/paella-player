import { defineConfig, searchForWorkspaceRoot } from 'vite'

export default defineConfig({
  server: {
    port: 8123,
    strictPort: true,
    fs: {
      allow: [
        searchForWorkspaceRoot(process.cwd()),
      ],
    },
  },
  optimizeDeps: {
    // Use local monorepo sources directly (no pre-bundling)
    exclude: [
      '@asicupv/paella-core',
      '@asicupv/paella-basic-plugins',
      '@asicupv/paella-video-plugins',
      '@asicupv/paella-webgl-plugins',
    ]
  }
})
