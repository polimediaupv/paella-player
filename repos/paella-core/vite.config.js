import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { readFileSync } from 'node:fs';

const pkgVersion = JSON.parse(
    readFileSync(new URL('./package.json', import.meta.url), 'utf8')
).version;

export default defineConfig(({ mode }) => ({
    root: './src',
    define: {
        __PAELLA_VERSION__: JSON.stringify(pkgVersion)
    },
    build: {
        // Generated declarations and workspace bundles must not trigger rebuilds.
        watch: mode === "development" ? { exclude: ["**/dist/**", "**/node_modules/**"] } : null,
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
        sourcemap: true,
        minify: mode === "development" ? false : "oxc"
    },
    plugins: [
        dts({
            entryRoot: 'js',
            outDirs: ['../dist'],
            include: ['js/**/*.ts', 'gobal.d.ts'],
            exclude: ['**/*.test.ts', '**/*.spec.ts']
        })
    ],
    optimizeDeps: {
        rolldownOptions: {
            sourcemap: true,
            minify: false
        }
    }
}));
