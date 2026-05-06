import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// 如果要部署到 Cloudflare Pages，取消下面兩行的註解：
// import cloudflare from '@astrojs/cloudflare';
// 並把 output 改成 'server'，adapter 設為 cloudflare()

export default defineConfig({
  // output: 'static' 代表全部靜態 SSG
  // output: 'hybrid' 代表大部分靜態，部分 SSR（建議電商用這個）
  // output: 'server' 代表全部 SSR（需配合 adapter，如 Cloudflare Pages）
  output: 'hybrid',

  integrations: [
    react()
  ],

  // Cloudflare Pages 部署時改成：
  // adapter: cloudflare(),
  // 並執行：npm install @astrojs/cloudflare
});
