import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  server: {
    host: true,
    port: 5173,
    watch: {
      ignored: [
        '**/*.mp4',
        '**/*.mkv',
        '**/*.avi',
        '**/*.mov',
        '**/*.wmv',
        '**/*.webm',
        '**/.git/**',
        '**/node_modules/**'
      ]
    }
  }
});
