/* eslint-disable import/no-extraneous-dependencies */
import vue from '@vitejs/plugin-vue';
import path from 'path';
import IconsResolver from 'unplugin-icons/resolver';
import Icons from 'unplugin-icons/vite';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import WindiCSS from 'vite-plugin-windicss';

// https://vitejs.dev/config/
export default defineConfig({
  envDir: '../',
  plugins: [
    vue(),
    WindiCSS(),
    Icons({ compiler: 'vue3' }),
    Components({
      resolvers: [IconsResolver()],
    }),
    VitePWA({
      includeAssets: ['favicon.ico'],
      manifest: {
        name: 'Döner-Dude Map',
        short_name: 'Döner-Dude Map',
        description: 'Finde den besten Döner in Kiel!',
        start_url: './',
        display: 'standalone',
        theme_color: '#2c3e50',
        background_color: '#FFFFFF',
        icons: [
          {
            src: 'img/icons/android-icon-144x144.png',
            sizes: '144x144',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'img/icons/maskable_icon_x128.png',
            sizes: '128x128',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
});
