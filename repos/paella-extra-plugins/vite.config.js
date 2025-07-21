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
                manualChunks: {                    
                    "shepherdjs": ["shepherd.js" ],
                    "cookieconsent": ["vanilla-cookieconsent" ],
                    "marked": ["marked", "marked-alert", 'marked-emoji', "./src/utils/emojis" ],
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
