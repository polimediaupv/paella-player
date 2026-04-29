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
                    if (id.includes('@langchain/core/messages') || id.includes('@langchain/core/prompts')) {
                        return 'paella-ai-plugins-langchain';
                    }
                    
                    // OpenAI
                    if (id.includes('@langchain/openai') || id.includes('openai')) {
                        return 'paella-ai-plugins-openai';
                    }
                    
                    // WebLLM
                    if (id.includes('@langchain/community/chat_models/webllm') || id.includes('@mlc-ai/web-llm')) {
                        return 'paella-ai-plugins-webllm';
                    }

                    // VoxtralRealTimeCaptions
                    if (id.includes('VoxtralRealTimeCaptions')) {
                        return 'paella-ai-plugins-rtc-voxtral';
                    }
                },
                chunkFileNames: (chunkInfo) => {
                    return "[name].[format].js";
                }
            },
            external: [                
                "@asicupv/paella-core",
                "url"
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
