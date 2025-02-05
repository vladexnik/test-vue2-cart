import { defineConfig } from 'vite';
import vue2 from '@vitejs/plugin-vue2';

export default defineConfig({
  plugins: [vue2()],
  resolve: {
    alias: {
      '@': '/src', // Ensure alias is configured
    },
  },
})
