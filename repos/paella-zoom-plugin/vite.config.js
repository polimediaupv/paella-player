import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts'

export default defineConfig({
    root: './src',
    build: {
        outDir: '../dist',
        lib: {
            entry: './index.ts',
            formats: ['es'],
        },
        rollupOptions: {          
            external: ["@asicupv/paella-core"],
            output: {
                assetFileNames: '[name].[ext]',
                sourcemapExcludeSources: false,
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
