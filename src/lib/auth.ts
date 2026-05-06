/**
 * JWT 驗證封裝
 * 外掛：JWT Authentication for WP REST API
 * https://tw.wordpress.org/plugins/jwt-authentication-for-wp-rest-api/
 */

const BASE = import.meta.env.PUBLIC_WC_URL;
const TOKEN_KEY = 'wc_jwt_token';
const USER_KEY = 'wc_user';

export interface WPUser {
  token: string;
  user_email: string;
  user_nicename: string;
  user_display_name: string;
  id?: number;
}

export async function login(username: string, password: string): Promise<WPUser> {
  const res = await fetch(`${BASE}/wp-json/jwt-auth/v1/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message ?? '登入失敗');
  }

  saveUser(data);
  return data;
}

export async function validateToken(token: string): Promise<boolean> {
  const res = await fetch(`${BASE}/wp-json/jwt-auth/v1/token/validate`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.ok;
}

export function saveUser(user: WPUser) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, user.token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser(): WPUser | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export function logout() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function isLoggedIn(): boolean {
  return !!getToken();
}
