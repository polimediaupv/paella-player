import { defineConfig } from 'vite';
import path from 'node:path';

export default defineConfig({
    root: './src',
    build: {
        outDir: '../dist',
        lib: {
            entry: './build-css.js',
            name: 'paella-slide-plugins'
        },
        rollupOptions: {
            output: {
                assetFileNames: assetInfo => {
                    return path.extname(assetInfo.name) === '.css' ? 'paella-slide-plugins.css' : assetInfo.name;
                }
            }
        }
    }
});
