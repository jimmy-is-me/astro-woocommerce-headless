import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// Cloudflare Pages 部署：使用 output: 'static'
// 所有頁面在 build 時靜態生成，不需要 adapter
// 優點：免費、超快、CDN 全球分發、SEO 最佳
// 如果之後需要 SSR（如動態搜尋、會員頁面），改成下面的 server 模式

export default defineConfig({
  output: 'static',
  integrations: [
    react()
  ],
});
