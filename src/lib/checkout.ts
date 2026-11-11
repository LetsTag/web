import { token, clearSession } from './auth';
import { loadPaddle } from './paddle';
import { getCatalog } from './pricing';
import type { BillingPeriod, PlanId } from '../data/pricing';

declare const __AUTH_API_BASE_URL__: string;
export type Selection = { plan: PlanId; period: BillingPeriod };
const key = 'pending_checkout';
export function pendingCheckout(): Selection | null {
    try { return JSON.parse(sessionStorage.getItem(key) || 'null'); } catch { return null; }
}
export function saveCheckout(selection: Selection) { sessionStorage.setItem(key, JSON.stringify(selection)); }
export function clearCheckout() { sessionStorage.removeItem(key); }
export async function openCheckout(selection: Selection, email?: string | null): Promise<'signin' | 'opened'> {
    const priceId = (await getCatalog())[`${selection.plan}_${selection.period}`];
    if (!/^pri_[a-z0-9]{26}$/.test(priceId || '')) throw new Error('This plan is not available.');
    saveCheckout(selection);
    if (!token()) return 'signin';
    const response = await fetch(`${__AUTH_API_BASE_URL__}/v1/checkout`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` }, body: JSON.stringify({ price_id: priceId }) });
    if (response.status === 401) { clearSession(); window.dispatchEvent(new Event('session-expired')); return 'signin'; }
    if (!response.ok) throw new Error('Checkout could not be opened. Please try again.');
    const { transaction_id } = await response.json() as { transaction_id: string };
    const paddle = await loadPaddle(() => {});
    if (!paddle || !transaction_id) throw new Error('Checkout could not be opened. Please try again.');
    paddle.Checkout.open({ transactionId: transaction_id, ...(email ? { customer: { email } } : {}) });
    clearCheckout();
    return 'opened';
}
