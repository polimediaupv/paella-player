import { defineConfig } from 'vite';
import path from 'node:path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
    root: './src',
    build: {
        outDir: '../dist',
        lib: {
            entry: './index.js',
            formats: ['es'],
            // name: 'paella-slide-plugins'
        },
        rollupOptions: {
            output: {
                assetFileNames: '[name].[ext]',
                // assetFileNames: assetInfo => {
                //     return path.extname(assetInfo.name) === '.css' ? 'paella-slide-plugins.css' : assetInfo.name;
                // }
            },
            external: ["@asicupv/paella-core"]
        },
        sourcemap: true
    },
    plugins: [
        viteStaticCopy({
            targets: [
                {
                    src: 'paella-slide-plugins.d.ts',
                    dest: '../dist'
                }
            ]
        })
    ]
});
