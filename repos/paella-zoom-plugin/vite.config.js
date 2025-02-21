import { defineConfig } from 'vite';

export default defineConfig({
    root: './src',
    build: {
        outDir: '../dist',
        lib: {
            entry: './index.js',
            name: 'paella-zoom-plugin'
        },
        sourcemap: true
    }
});
