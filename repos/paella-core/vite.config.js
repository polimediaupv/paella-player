import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import dts from 'vite-plugin-dts';
import path from 'node:path';

export default defineConfig({
    root: './src',
    build: {
        outDir: '../dist',
        lib: {
            entry: './js/index.ts',
            formats: ['es'],
            fileName: 'paella-core'
        },
        rollupOptions: {
            output: {
                assetFileNames: '[name].[ext]',
                // assetFileNames: assetInfo => {
                //     return path.extname(assetInfo.name) === '.css' ? 'paella-core.css' : assetInfo.name;
                // }
            }
        },
        sourcemap: true
    },
    plugins: [
        dts({
            entryRoot: 'js',
            outDir: '../dist',
            include: ['js/**/*.ts'],
            exclude: ['**/*.test.ts', '**/*.spec.ts']
        })
    ]
});
