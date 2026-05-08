import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// Static editorial site for Cloudflare Pages.
// No server adapter is needed while the site is fully prerendered/static.
export default defineConfig({
  site: 'https://centroeconomex.org',
  integrations: [mdx(), sitemap()],

  build: {
    inlineStylesheets: 'auto',
  },
});
