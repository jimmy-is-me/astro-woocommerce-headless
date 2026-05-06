# Astro + WooCommerce Headless Storefront

以 Astro 做前端，WooCommerce REST API 當後台，打造超快速 Headless 電商網站。

## 技術棧

- [Astro](https://astro.build/) — 靜態網站框架，商品頁零 JS，SEO 極佳
- [React](https://react.dev/) — Astro Islands，只有互動元件（購物車、登入）才載入 JS
- [WooCommerce REST API](https://woocommerce.github.io/woocommerce-rest-api-docs/) — 商品、訂單、會員資料
- [CoCart](https://cocartapi.com/) — Headless 購物車 API
- [JWT Authentication for WP REST API](https://tw.wordpress.org/plugins/jwt-authentication-for-wp-rest-api/) — 會員登入驗證

## 架構說明

```
Astro 前端 (Cloudflare Pages / Vercel)
  ├─ 商品列表 / 商品頁  → 純靜態 HTML (SSG)
  ├─ 加入購物車按鈕    → React Island
  ├─ 購物車 Sidebar   → React Island (CoCart)
  └─ 登入 / 會員中心  → React Island (JWT)
           ↓ REST API
WordPress + WooCommerce (維持原有後台)
```

## 快速開始

### 1. Clone 專案

```bash
git clone https://github.com/jimmy-is-me/astro-woocommerce-headless.git
cd astro-woocommerce-headless
npm install
```

### 2. 設定環境變數

複製 `.env.example` 為 `.env`：

```bash
cp .env.example .env
```

填入你的 WooCommerce 設定：

```env
WC_URL=https://your-wordpress-site.com
WC_KEY=ck_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
WC_SECRET=cs_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
PUBLIC_WC_URL=https://your-wordpress-site.com
```

### 3. WordPress 後台必裝外掛

| 外掛 | 用途 |
|---|---|
| CoCart | Headless 購物車 API |
| JWT Authentication for WP REST API | 會員登入驗證 |
| WP CORS 或手動 Nginx CORS 設定 | 跨網域允許 |

`wp-config.php` 加入 JWT 設定：

```php
define('JWT_AUTH_SECRET_KEY', 'your-random-long-secret-key-here');
define('JWT_AUTH_CORS_ENABLE', true);
```

### 4. 啟動開發伺服器

```bash
npm run dev
```

### 5. 部署到 Cloudflare Pages

1. 把此 Repo 連接到 Cloudflare Pages
2. Build command: `npm run build`
3. Output directory: `dist`
4. 在 Cloudflare Pages 設定 Environment Variables（同 `.env`）

> 注意：若使用 Cloudflare Pages，需改用 `output: 'server'` 並加 `@astrojs/cloudflare` adapter，請見 `astro.config.mjs` 說明。

## 頁面路由

| 路徑 | 說明 |
|---|---|
| `/` | 首頁，顯示精選商品 |
| `/products` | 商品列表 |
| `/products/[slug]` | 商品頁 |
| `/cart` | 購物車 |
| `/login` | 登入 |
| `/account` | 會員中心 |
| `/account/orders` | 訂單查詢 |

## 注意事項

- `WC_KEY` / `WC_SECRET` 只在 Astro server side 使用，不會暴露給瀏覽器
- 結帳第一版導回 WooCommerce 原生 `/checkout`，保留既有金流
- 購物車狀態用 `localStorage` 存 CoCart cart key
