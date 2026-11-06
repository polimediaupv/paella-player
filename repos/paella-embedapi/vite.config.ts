import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';


export default defineConfig(({ mode }) => ({
    resolve: { alias: { src: resolve('src/') } },
    build: {
        // Generated declarations and workspace bundles must not trigger rebuilds.
        watch: mode === "development" ? { exclude: ["**/dist/**", "**/node_modules/**"] } : null,
        sourcemap: true,
        outDir: './dist',
        lib: {
            entry: './src/index.ts',
            formats: ['es', 'cjs'],
            name: 'PaellaEmbedApi',
            fileName: (format) => format === 'cjs' ? 'paella-embedapi.cjs' : 'paella-embedapi.es.js'
        },
        rollupOptions: {
            external: ['@asicupv/paella-core'],
            output: {
                sourcemapExcludeSources: false,
            }
        }
    },
    plugins: [dts({
        outDirs: ['dist/types'],
        insertTypesEntry: true
    })]
}));
