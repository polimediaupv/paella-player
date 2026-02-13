import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts'

export default defineConfig({
    root: './src',
    build: {
        outDir: '../dist',
        lib: {
            entry: './index.js',
            formats: ['es'],
        },
        rollupOptions: {          
            external: ["@asicupv/paella-core"],
            output: {
                assetFileNames: '[name].[ext]',             
            }
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
