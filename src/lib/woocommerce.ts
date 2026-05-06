/**
 * WooCommerce REST API 封裝
 * WC_KEY / WC_SECRET 只在 server side 使用，不暴露給瀏覽器
 */

const BASE = import.meta.env.WC_URL;
const KEY = import.meta.env.WC_KEY;
const SECRET = import.meta.env.WC_SECRET;

function wcUrl(path: string, params: Record<string, string | number> = {}) {
  const url = new URL(`${BASE}/wp-json/wc/v3${path}`);
  url.searchParams.set('consumer_key', KEY);
  url.searchParams.set('consumer_secret', SECRET);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
  return url.toString();
}

// ── 商品 ──────────────────────────────────────────────

export async function getProducts(params: Record<string, string | number> = {}) {
  const res = await fetch(wcUrl('/products', { per_page: 24, status: 'publish', ...params }), {
    cache: 'no-store'
  });
  if (!res.ok) throw new Error(`getProducts failed: ${res.status}`);
  return res.json();
}

export async function getProductBySlug(slug: string) {
  const res = await fetch(wcUrl('/products', { slug }), { cache: 'no-store' });
  if (!res.ok) throw new Error(`getProductBySlug failed: ${res.status}`);
  const products = await res.json();
  return products[0] ?? null;
}

export async function getCategories() {
  const res = await fetch(wcUrl('/products/categories', { per_page: 50, hide_empty: 1 }), {
    cache: 'no-store'
  });
  if (!res.ok) throw new Error(`getCategories failed: ${res.status}`);
  return res.json();
}

// ── 訂單 ──────────────────────────────────────────────

export async function getOrdersByCustomer(customerId: number, token: string) {
  const res = await fetch(wcUrl('/orders', { customer: customerId, per_page: 20 }), {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store'
  });
  if (!res.ok) throw new Error(`getOrdersByCustomer failed: ${res.status}`);
  return res.json();
}

// ── 顧客 ──────────────────────────────────────────────

export async function getCustomer(customerId: number, token: string) {
  const res = await fetch(wcUrl(`/customers/${customerId}`), {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store'
  });
  if (!res.ok) throw new Error(`getCustomer failed: ${res.status}`);
  return res.json();
}
