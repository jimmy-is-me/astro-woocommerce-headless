/**
 * CoCart API 封裝（購物車）
 * CoCart 請求從瀏覽器直接發出，透過 cart key 維持 session
 * https://cocartapi.com/
 */

const BASE = import.meta.env.PUBLIC_WC_URL;
const CART_KEY_STORAGE = 'cocart_cart_key';

function cartBase() {
  return `${BASE}/wp-json/cocart/v2`;
}

export function getCartKey(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(CART_KEY_STORAGE);
}

function saveCartKey(key: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(CART_KEY_STORAGE, key);
  }
}

async function cocartFetch(path: string, options: RequestInit = {}) {
  const cartKey = getCartKey();
  const url = new URL(`${cartBase()}${path}`);
  if (cartKey) url.searchParams.set('cart_key', cartKey);

  const res = await fetch(url.toString(), {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {})
    }
  });

  // 儲存 CoCart 回傳的 cart key
  const newKey = res.headers.get('X-CoCart-API');
  if (newKey) saveCartKey(newKey);

  return res;
}

export async function getCart() {
  const res = await cocartFetch('/cart');
  if (!res.ok) throw new Error('getCart failed');
  return res.json();
}

export async function addToCart(productId: number, quantity = 1) {
  const res = await cocartFetch('/cart/add-item', {
    method: 'POST',
    body: JSON.stringify({ id: String(productId), quantity: String(quantity) })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.message ?? '加入購物車失敗');
  }
  return res.json();
}

export async function updateCartItem(itemKey: string, quantity: number) {
  const res = await cocartFetch(`/cart/item/${itemKey}`, {
    method: 'POST',
    body: JSON.stringify({ quantity: String(quantity) })
  });
  if (!res.ok) throw new Error('更新購物車失敗');
  return res.json();
}

export async function removeCartItem(itemKey: string) {
  const res = await cocartFetch(`/cart/item/${itemKey}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('刪除購物車項目失敗');
  return res.json();
}

export async function clearCart() {
  const res = await cocartFetch('/cart/clear', { method: 'POST' });
  if (!res.ok) throw new Error('清空購物車失敗');
  return res.json();
}
