import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
    root: './src',
    build: {
        outDir: '../dist',
        lib: {
            entry: './js/index.ts',
            formats: ['es'],
            fileName: 'paella-core'
        },
        rollupOptions: {
            output: {
                assetFileNames: '[name].[ext]',
                sourcemapExcludeSources: false,
                sourcemapPathTransform: (relativeSourcePath) => {
                    return relativeSourcePath;
                },
                // assetFileNames: assetInfo => {
                //     return path.extname(assetInfo.name) === '.css' ? 'paella-core.css' : assetInfo.name;
                // }
            }
        },
        sourcemap: true
    },
    plugins: [
        dts({
            entryRoot: 'js',
            outDir: '../dist',
            include: ['js/**/*.ts'],
            exclude: ['**/*.test.ts', '**/*.spec.ts']
        })
    ],
    optimizeDeps: {
        esbuildOptions: {
            sourcemap: true
        }
    }
});
