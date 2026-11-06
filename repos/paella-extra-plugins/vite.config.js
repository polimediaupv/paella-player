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
            name: 'paella-extra-plugins',
            fileName: (format) => format === 'cjs' ? 'paella-extra-plugins.cjs' : 'paella-extra-plugins.es.js'
        },
        rollupOptions: {
            output: ['es', 'cjs'].map(format => ({
                format,
                assetFileNames: 'paella-extra-plugins.[ext]',
                sourcemapExcludeSources: false,
                manualChunks(id) {
                    // 1. Shepherd
                    if (id.includes('shepherd.js')) {
                        return 'shepherdjs';
                    }
                    
                    // 2. Cookie Consent
                    if (id.includes('vanilla-cookieconsent')) {
                        return 'cookieconsent';
                    }
                    
                    // 3. Marked
                    const markedModules = ['marked', 'marked-alert', 'marked-emoji', '/src/utils/emojis'];
                    if (markedModules.some(mod => id.includes(mod))) {
                        return 'marked';
                    }
                },
                chunkFileNames: format === 'cjs' ? 'paella-extra-plugins-[name].cjs' : 'paella-extra-plugins-[name].es.js'
            })),
            external: [
                "@asicupv/paella-core",
                "@asicupv/paella-embedapi"
            ]
        }
    },
    plugins: [dts({
        outDirs: ['dist/types'],
        insertTypesEntry: true
    })]
}));
