import { useState, useEffect } from 'react';
import { getCart, updateCartItem, removeCartItem } from '../lib/cocart';

export default function CartWidget() {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const WC_URL = import.meta.env.PUBLIC_WC_URL;

  async function fetchCart() {
    try {
      const data = await getCart();
      setCart(data);
    } catch {}
    setLoading(false);
  }

  useEffect(() => { fetchCart(); }, []);

  async function handleQtyChange(itemKey: string, qty: number) {
    if (qty <= 0) {
      await removeCartItem(itemKey);
    } else {
      await updateCartItem(itemKey, qty);
    }
    fetchCart();
  }

  if (loading) return <p style={{ textAlign: 'center', padding: '2rem' }}>載入中...</p>;

  const items = Object.values(cart?.items ?? {}) as any[];

  if (items.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <p style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>購物車是空的</p>
        <a href="/products" style={{
          background: '#1a1a1a', color: '#fff',
          borderRadius: 8, padding: '0.75rem 2rem'
        }}>繼續購物</a>
      </div>
    );
  }

  return (
    <div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
            <th style={{ textAlign: 'left', padding: '0.5rem' }}>商品</th>
            <th style={{ textAlign: 'center', padding: '0.5rem' }}>數量</th>
            <th style={{ textAlign: 'right', padding: '0.5rem' }}>小計</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item: any) => (
            <tr key={item.item_key} style={{ borderBottom: '1px solid #f3f4f6' }}>
              <td style={{ padding: '1rem 0.5rem', display: 'flex', alignItems: 'center', gap: 12 }}>
                {item.featured_image && (
                  <img src={item.featured_image} alt={item.name} width={60} height={60}
                    style={{ objectFit: 'cover', borderRadius: 4 }} />
                )}
                <span>{item.name}</span>
              </td>
              <td style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <button onClick={() => handleQtyChange(item.item_key, item.quantity.value - 1)}
                    style={{ width: 28, height: 28, borderRadius: 4, border: '1px solid #d1d5db', cursor: 'pointer' }}>-</button>
                  <span>{item.quantity.value}</span>
                  <button onClick={() => handleQtyChange(item.item_key, item.quantity.value + 1)}
                    style={{ width: 28, height: 28, borderRadius: 4, border: '1px solid #d1d5db', cursor: 'pointer' }}>+</button>
                </div>
              </td>
              <td style={{ textAlign: 'right', padding: '0.5rem' }}>
                {cart.currency?.currency_symbol}{item.totals?.subtotal}
              </td>
              <td style={{ textAlign: 'right', padding: '0.5rem' }}>
                <button onClick={() => handleQtyChange(item.item_key, 0)}
                  style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{
        marginTop: '1.5rem',
        padding: '1.5rem',
        background: '#f9fafb',
        borderRadius: 8,
        textAlign: 'right'
      }}>
        <p style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
          總計：{cart.currency?.currency_symbol}{cart.totals?.total}
        </p>
        {/* 結帳導回 WooCommerce 原生 checkout，保留既有金流 */}
        <a
          href={`${WC_URL}/checkout`}
          style={{
            display: 'inline-block',
            background: '#1a1a1a',
            color: '#fff',
            borderRadius: 8,
            padding: '0.75rem 2.5rem',
            fontSize: '1.1rem'
          }}
        >
          前往結帳
        </a>
      </div>
    </div>
  );
}
