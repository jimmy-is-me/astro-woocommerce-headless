import { useState } from 'react';
import { login } from '../lib/auth';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(username, password);
      window.location.href = '/account';
    } catch (err: any) {
      setError(err.message ?? '帳號或密碼錯誤');
    } finally {
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.75rem 1rem',
    border: '1px solid #d1d5db',
    borderRadius: 8,
    fontSize: '1rem',
    marginBottom: '1rem'
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '0 auto' }}>
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>帳號 / Email</label>
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          style={inputStyle}
          placeholder="your@email.com"
        />
      </div>
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>密碼</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={inputStyle}
          placeholder="••••••••"
        />
      </div>
      {error && (
        <p style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</p>
      )}
      <button
        type="submit"
        disabled={loading}
        style={{
          width: '100%',
          background: loading ? '#9ca3af' : '#1a1a1a',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          padding: '0.75rem',
          fontSize: '1rem',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? '登入中...' : '登入'}
      </button>
      <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
        還沒有帳號？<a href={`${import.meta.env.PUBLIC_WC_URL}/my-account`} target="_blank" style={{ color: '#1a1a1a', fontWeight: 600 }}>前往 WooCommerce 註冊</a>
      </p>
    </form>
  );
}
