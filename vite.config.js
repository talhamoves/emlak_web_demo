import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                listings: resolve(__dirname, 'listings.html'),
                details: resolve(__dirname, 'details.html'),
                blog: resolve(__dirname, 'blog.html'),
                blogDetail: resolve(__dirname, 'blog-detail.html'),
                about: resolve(__dirname, 'about.html'),
                admin: resolve(__dirname, 'admin.html'),
                login: resolve(__dirname, 'login.html'),
            },
        },
    },
});
