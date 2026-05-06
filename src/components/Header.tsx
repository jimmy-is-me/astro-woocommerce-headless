import { useState, useEffect } from 'react';
import { getUser, logout, isLoggedIn } from '../lib/auth';
import { getCart } from '../lib/cocart';

export default function Header() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    setLoggedIn(isLoggedIn());
    getCart()
      .then(cart => {
        const count = Object.keys(cart.items || {}).length;
        setCartCount(count);
      })
      .catch(() => {});
  }, []);

  function handleLogout() {
    logout();
    setLoggedIn(false);
    window.location.href = '/';
  }

  return (
    <header style={{
      background: '#fff',
      borderBottom: '1px solid #e5e7eb',
      padding: '0 1rem'
    }}>
      <nav style={{
        maxWidth: 1200,
        margin: '0 auto',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <a href="/" style={{ fontWeight: 700, fontSize: '1.25rem' }}>🛍 我的商店</a>

        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <a href="/products">商品</a>
          <a href="/cart" style={{ position: 'relative' }}>
            購物車
            {cartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: -8, right: -12,
                background: '#ef4444',
                color: '#fff',
                borderRadius: '999px',
                padding: '0 6px',
                fontSize: '0.7rem',
                fontWeight: 700
              }}>{cartCount}</span>
            )}
          </a>
          {loggedIn ? (
            <>
              <a href="/account">會員中心</a>
              <button
                onClick={handleLogout}
                style={{
                  background: 'none', border: '1px solid #d1d5db',
                  borderRadius: 8, padding: '0.4rem 1rem',
                  cursor: 'pointer'
                }}
              >登出</button>
            </>
          ) : (
            <a href="/login" style={{
              background: '#1a1a1a', color: '#fff',
              borderRadius: 8, padding: '0.4rem 1rem'
            }}>登入</a>
          )}
        </div>
      </nav>
    </header>
  );
}
