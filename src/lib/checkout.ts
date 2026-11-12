import { token, clearSession } from './auth';
import { loadPaddle } from './paddle';
import { getCatalog } from './pricing';
declare const __AUTH_API_BASE_URL__: string;
export async function openCheckout(email?: string | null): Promise<'signin' | 'opened'> {
    if (!token()) return 'signin';
    const priceId = (await getCatalog()).prices.pro;
    const response = await fetch(`${__AUTH_API_BASE_URL__}/v1/checkout`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` }, body: JSON.stringify({ price_id: priceId }) });
    if (response.status === 401) { clearSession(); window.dispatchEvent(new Event('session-expired')); return 'signin'; }
    if (!response.ok) throw new Error('Checkout unavailable');
    const { transaction_id } = await response.json() as { transaction_id: string };
    const paddle = await loadPaddle(() => {});
    if (!paddle || !transaction_id) throw new Error('Checkout unavailable');
    paddle.Checkout.open({ transactionId: transaction_id, ...(email ? { customer: { email } } : {}) });
    return 'opened';
}
