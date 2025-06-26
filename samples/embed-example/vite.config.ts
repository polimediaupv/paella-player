
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy'



export default  defineConfig({
    build: {        
        rollupOptions: {
            input: {
                index: 'index.html',
                paella: 'player/index.html',
                ex1_youtube: 'examples/ex1-youtube.html',
                ex1_paella:  'examples/ex1-paella.html',
                ex2_youtube: 'examples/ex2-youtube.html',
                ex2_paella:  'examples/ex2-paella.html',
                ex3_youtube: 'examples/ex3-youtube.html',
                ex3_paella:  'examples/ex3-paella.html',
                ex4_youtube: 'examples/ex4-youtube.html',
                ex4_paella:  'examples/ex4-paella.html',
            }
        }        
    }
})
