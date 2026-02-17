import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

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
                sourcemapExcludeSources: false,
            },
            external: ["@asicupv/paella-core"]
        },
        sourcemap: true
    },
    plugins: [
        dts({
            entryRoot: './',
            outDir: '../dist',
            include: ['**/*.ts'],
            exclude: ['**/*.test.ts', '**/*.spec.ts']
        })
    ]
});
