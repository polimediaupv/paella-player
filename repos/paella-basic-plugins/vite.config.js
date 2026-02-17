import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
    root: './src',
    build: {
        outDir: '../dist',
        lib: {
            entry: './index.ts',
            formats: ['es'],
            fileName: 'paella-basic-plugins'
        },
        rollupOptions: {
            output: {
                assetFileNames: '[name].[ext]',
                sourcemapExcludeSources: false,
                sourcemapPathTransform: (relativeSourcePath) => {
                    return relativeSourcePath;
                },
                // assetFileNames: assetInfo => {
                //     return path.extname(assetInfo.name) === '.css' ? 'paella-basic-plugins.css' : assetInfo.name;
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
