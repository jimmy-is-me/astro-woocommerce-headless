import { useState } from 'react';
import { addToCart } from '../lib/cocart';

interface Props {
  productId: number;
  productName: string;
}

export default function AddToCartButton({ productId, productName }: Props) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  async function handleAdd() {
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      await addToCart(productId);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (e: any) {
      setError(e.message ?? '加入失敗');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleAdd}
        disabled={loading}
        style={{
          background: loading ? '#9ca3af' : '#1a1a1a',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          padding: '0.75rem 2rem',
          fontSize: '1rem',
          cursor: loading ? 'not-allowed' : 'pointer',
          width: '100%'
        }}
      >
        {loading ? '加入中...' : success ? '✓ 已加入購物車' : '加入購物車'}
      </button>
      {error && <p style={{ color: '#ef4444', marginTop: 8, fontSize: '0.875rem' }}>{error}</p>}
    </div>
  );
}
