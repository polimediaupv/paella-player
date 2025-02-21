import { defineConfig, searchForWorkspaceRoot } from 'vite'
  
export default defineConfig({
  server: {
    fs: {
      allow: [
        // search up for workspace root
        searchForWorkspaceRoot(process.cwd()),
        // your custom rules
        '../../repos/',
      ],
    },
  },
})