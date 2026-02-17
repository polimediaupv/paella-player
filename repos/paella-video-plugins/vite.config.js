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
            output: {
                assetFileNames: '[name].[ext]',
                chunkFileNames: '[name].js',
                sourcemapExcludeSources: false,
                // assetFileNames: assetInfo => {
                //     return path.extname(assetInfo.name) === '.css' ? 'paella-video-plugins.css' : assetInfo.name;
                // },
                // chunkFileNames: (chunkInfo) => {
                //     return "[name].js";
                // },

                exports: 'named'
            },
            external: ["@asicupv/paella-core"]
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
