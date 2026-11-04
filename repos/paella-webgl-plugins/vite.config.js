import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts'

export default defineConfig(({ mode }) => ({
    root: './src',
    build: {
        // Generated declarations and workspace bundles must not trigger rebuilds.
        watch: mode === "development" ? { exclude: ["**/dist/**", "**/node_modules/**"] } : null,
        outDir: '../dist',
        lib: {
            entry: './index.ts',
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
            outDirs: ['../dist'],
            include: ['**/*.ts'],
            exclude: ['**/*.test.ts', '**/*.spec.ts']
        })
    ]
}));
