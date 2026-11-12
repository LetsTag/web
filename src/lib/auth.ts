declare const __AUTH_API_BASE_URL__: string;
export type User = { name: string | null; email: string | null; picture: string | null; has_purchased_credits: boolean };
export const token = () => localStorage.getItem('session_token');
export function clearSession() { localStorage.removeItem('session_token'); localStorage.removeItem('session_expires_at'); }
export async function sessionRequest(path: string, method = 'GET', body?: unknown) {
    return fetch(`${__AUTH_API_BASE_URL__}${path}`, { method, headers: { Authorization: `Bearer ${token()}`, ...(body === undefined ? {} : { 'Content-Type': 'application/json' }) }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
}
export async function getUser(): Promise<User | null> {
    if (!token()) return null;
    const response = await sessionRequest('/auth/me');
    if (response.status === 401) { clearSession(); return null; }
    if (!response.ok) throw new Error('Unable to load account');
    return response.json();
}
