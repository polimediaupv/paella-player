import { defineConfig } from 'vite';
import path from 'node:path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
    root: './src',
    build: {
        outDir: '../dist',
        lib: {
            entry: './index.js',
            name: 'paella-video-plugins'
        },
        rollupOptions: {
            output: {
                assetFileNames: assetInfo => {
                    return path.extname(assetInfo.name) === '.css' ? 'paella-video-plugins.css' : assetInfo.name;
                },
                chunkFileNames: (chunkInfo) => {
                    return "[name].js";
                },

                exports: 'named'
            }
        },
        sourcemap: true
    },
    plugins: [
        viteStaticCopy({
            targets: [
                {
                    src: 'paella-video-plugins.d.ts',
                    dest: '../dist'
                }
            ]
        })
    ]
});
