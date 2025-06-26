
import { defineConfig } from 'vite';
import { resolve } from 'path';



export default defineConfig({
  resolve: { alias: { src: resolve('src/') } },
  build: {
      sourcemap: true,
      outDir: './dist',
      copyPublicDir: false,
      emptyOutDir: false,
      lib: {
          entry: './src/paella-embedapi.ts',
          formats: ['iife'],
          name: 'PaellaEmbedApi',
          fileName: (format) => `paella-embedapi.js`
      }
  }
});
