import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

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
        viteStaticCopy({
            targets: [
                {
                    src: 'paella-zoom-plugin.d.ts',
                    dest: '../dist'
                }
            ]
        })
    ]
});
