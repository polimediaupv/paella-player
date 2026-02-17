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
            output: {
                assetFileNames: '[name].[ext]',
                sourcemapExcludeSources: false,
            },
            external: ["@asicupv/paella-core"]
        },
        sourcemap: true
    },
    plugins: [
        viteStaticCopy({
            targets: [
                {
                    src: 'paella-webgl-plugins.d.ts',
                    dest: '../dist'
                }
            ]
        })
    ]
});
