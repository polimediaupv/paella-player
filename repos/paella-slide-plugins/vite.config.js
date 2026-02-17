import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
    root: './src',
    build: {
        outDir: '../dist',
        lib: {
            entry: './index.js',
            formats: ['es'],
            // name: 'paella-slide-plugins'
        },
        rollupOptions: {
            output: {
                assetFileNames: '[name].[ext]',
                sourcemapExcludeSources: false,
                // assetFileNames: assetInfo => {
                //     return path.extname(assetInfo.name) === '.css' ? 'paella-slide-plugins.css' : assetInfo.name;
                // }
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
