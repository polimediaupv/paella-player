import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
// import react from '@vitejs/plugin-react'
import preact from '@preact/preset-vite';
import { resolve } from 'path';

export default defineConfig(({ mode }) => ({
    
    resolve: { 
        alias: {
            src: resolve('src/'),
            'react': 'preact/compat',
            'react-dom': 'preact/compat',
        }
    },
    build: {
        // Generated declarations and workspace bundles must not trigger rebuilds.
        watch: mode === "development" ? { exclude: ["**/dist/**", "**/node_modules/**"] } : null,
        sourcemap: true,
        outDir: './dist',
        lib: {
            entry: './src/index.ts',
            formats: ['es'],
            name: 'paella-ai-plugins',
            fileName: (format) => `paella-ai-plugins.${format}.js`
        },
        rollupOptions: {
            
            output: {
                assetFileNames: 'paella-ai-plugins.[ext]',
                sourcemapExcludeSources: false,
                manualChunks(id) {
                    // Langchain core
                    if (id.includes('@langchain/core')) {
                        return 'langchain';
                    }
                    
                    // // OpenAI
                    if (id.includes('@langchain/openai') || id.includes('openai')) {
                        return 'openai';
                    }
                    
                    // // WebLLM
                    // if (id.includes('ai/ChatWebLLM') || id.includes('@mlc-ai/web-llm') ) {
                    //     return 'webllm';
                    // }

                    // transformers.js
                    if (id.includes('@huggingface/transformers') ) {
                        return 'transformers';
                    }
                    
                    // VoxtralRealTimeCaptions
                    // if (id.includes('VoxtralRealTimeCaptions')) {
                    //     return 'rtc-voxtral';
                    // }
                },
                chunkFileNames: "paella-ai-plugins-[name].[format].js"
            },
            external: [                
                "@asicupv/paella-core",
                "@huggingface/transformers",
                "url"
            ],            
        }
    },
    plugins: [
        dts({
            outDirs: ['dist/types'],
            insertTypesEntry: true
        }),
        preact(),
    ]
}));
