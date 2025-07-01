import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
// import react from '@vitejs/plugin-react'
import preact from '@preact/preset-vite';
import { resolve } from 'path';


export default defineConfig({
    resolve: { 
        alias: {
            src: resolve('src/'),
            'react': 'preact/compat',
            'react-dom': 'preact/compat',
        }
    },
    build: {
        sourcemap: true,
        outDir: './dist',
        lib: {
            entry: './src/index.ts',
            formats: ['es', 'cjs'],
            name: 'paella-ai-plugins',
            fileName: (format) => `paella-ai-plugins.${format}.js`
        },
        rollupOptions: {
            output: {
                assetFileNames: 'paella-ai-plugins.[ext]'                
            },
            external: [                
                "@asicupv/paella-core"
            ],            
        }
    },
    plugins: [
        dts({
            outDir: 'dist/types',
            insertTypesEntry: true
        }),
        preact(),
    ]
});
