import { useState, useEffect } from 'react';
import { getUser, isLoggedIn, logout } from '../lib/auth';

export default function AccountDashboard() {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const WC_URL = import.meta.env.PUBLIC_WC_URL;

  useEffect(() => {
    if (!isLoggedIn()) {
      window.location.href = '/login';
      return;
    }
    const u = getUser();
    setUser(u);

    // 取訂單：透過 Next.js API route 或直接呼叫
    // 這裡示範先連到 WooCommerce my-account 頁查看
    setLoading(false);
  }, []);

  if (loading) return <p>載入中...</p>;
  if (!user) return null;

  return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      <div style={{
        background: '#fff',
        borderRadius: 12,
        padding: '2rem',
        border: '1px solid #e5e7eb',
        marginBottom: '2rem'
      }}>
        <h2 style={{ marginBottom: '0.5rem' }}>歡迎回來！</h2>
        <p style={{ color: '#6b7280' }}>{user.user_email}</p>
        <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: 4 }}>顯示名稱：{user.user_display_name}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <a href={`${WC_URL}/my-account/orders`} target="_blank" style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: 12,
          padding: '1.5rem',
          display: 'block',
          transition: 'box-shadow 0.2s'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: 8 }}>📦</div>
          <h3>訂單紀錄</h3>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: 4 }}>查看歷史訂單與狀態</p>
        </a>

        <a href={`${WC_URL}/my-account/edit-account`} target="_blank" style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: 12,
          padding: '1.5rem',
          display: 'block'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: 8 }}>👤</div>
          <h3>帳號設定</h3>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: 4 }}>修改個人資料與密碼</p>
        </a>

        <a href={`${WC_URL}/my-account/edit-address`} target="_blank" style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: 12,
          padding: '1.5rem',
          display: 'block'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: 8 }}>📍</div>
          <h3>收件地址</h3>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: 4 }}>管理配送地址</p>
        </a>

        <button
          onClick={() => { logout(); window.location.href = '/'; }}
          style={{
            background: '#fff',
            border: '1px solid #fecaca',
            borderRadius: 12,
            padding: '1.5rem',
            cursor: 'pointer',
            textAlign: 'left'
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: 8 }}>🚪</div>
          <h3 style={{ color: '#ef4444' }}>登出</h3>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: 4 }}>安全登出帳號</p>
        </button>
      </div>
    </div>
  );
}
