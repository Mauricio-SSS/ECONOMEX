import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://centroeconomex.org',
  integrations: [mdx(), sitemap()],

  build: {
    inlineStylesheets: 'auto',
  },

  adapter: cloudflare(),
});