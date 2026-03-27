import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';


export default defineConfig({
    resolve: { alias: { src: resolve('src/') } },
    build: {
        sourcemap: true,
        outDir: './dist',
        lib: {
            entry: './src/index.ts',
            formats: ['es', 'cjs'],
            name: 'paella-extra-plugins',
            fileName: (format) => `paella-extra-plugins.${format}.js`
        },
        rollupOptions: {
            output: {
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
                chunkFileNames: "paella-extra-plugins-[name].[format].js"
            },
            external: [                
                "@asicupv/paella-core"
            ]
        }
    },
    plugins: [dts({
        outDir: 'dist/types',
        insertTypesEntry: true
    })]
});
