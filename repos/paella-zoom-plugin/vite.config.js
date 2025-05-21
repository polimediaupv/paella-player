import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
    root: './src',
    build: {
        outDir: '../dist',
        lib: {
            entry: './index.js',
            name: 'paella-zoom-plugin'
        },
        sourcemap: true
    },
    plugins: [
        viteStaticCopy({
            targets: [
                {
                    src: 'paella-zoom-plugin.d.ts',
                    dest: '../dist'
                }
            ]
        })
    ]
});
