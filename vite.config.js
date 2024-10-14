import { defineConfig } from 'vite';
import removeConsole from 'vite-plugin-remove-console';

export default defineConfig({
  base: './',
  server: {
    host: '127.0.0.1',
    port: 5500,
  },
  build: {
    outDir: 'prod',
    rollupOptions: {
      input: {
        main: './index.html',
      },
      output: {
        manualChunks: undefined,
        chunkFileNames: ({ name }) => {
          if (name === 'vendors/fullcalendar/main.min.js') {
            return 'vendors/fullcalendar/main.min.mjs';
          }
          return 'chunk/[name].[hash].js';
        },
      },
    },
    target: 'es2018',
  },
  plugins: [removeConsole()],
  // css: {
  //   postcss: './postcss.config.js',
  // },
});
