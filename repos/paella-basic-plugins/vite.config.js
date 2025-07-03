import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import path from 'node:path';

export default defineConfig({
    root: './src',
    build: {
        outDir: '../dist',
        lib: {
            entry: './index.js',
            formats: ['es'],
        },
        rollupOptions: {
            output: {
                assetFileNames: '[name].[ext]',
                // assetFileNames: assetInfo => {
                //     return path.extname(assetInfo.name) === '.css' ? 'paella-basic-plugins.css' : assetInfo.name;
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
                    src: 'paella-basic-plugins.d.ts',
                    dest: '../dist'
                }
            ]
        })
    ]
});
