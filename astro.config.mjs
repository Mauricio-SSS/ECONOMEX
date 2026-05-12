import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// Centro Economex is deployed as a static Cloudflare Pages site.
// Keep this config adapter-free: adding the Cloudflare adapter makes Astro
// start a prerender worker and can surface stale dynamic-route errors during
// Cloudflare builds.
export default defineConfig({
  site: 'https://centroeconomex.org',
  output: 'static',
  integrations: [mdx(), sitemap()],

  build: {
    inlineStylesheets: 'auto',
  },
});
