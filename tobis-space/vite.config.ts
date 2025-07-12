import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'

// Set base path for GitHub Pages when the GITHUB_PAGES env variable is defined
const base = process.env.GITHUB_PAGES ? '/baseHomePage/' : '/'

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
})
