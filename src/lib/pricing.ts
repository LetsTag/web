import { loadPaddle } from './paddle';
declare const __AUTH_API_BASE_URL__: string;
export type CreditCatalog = { prices: { pro: string }; free_credits: number; pro_credits: number };
export async function getCatalog(): Promise<CreditCatalog> {
    const response = await fetch(`${__AUTH_API_BASE_URL__}/v1/pricing/catalog`);
    if (!response.ok) throw new Error('Pricing unavailable');
    const data = await response.json() as CreditCatalog;
    if (!data.prices?.pro || !Number.isInteger(data.free_credits) || !Number.isInteger(data.pro_credits)) throw new Error('Invalid pricing');
    return data;
}
export async function previewProPrice(priceId: string): Promise<string> {
    const paddle = await loadPaddle(() => {});
    if (!paddle) throw new Error('Pricing unavailable');
    const response = await paddle.PricePreview({ items: [{ priceId, quantity: 1 }] });
    const amount = response.data.details.lineItems.find(item => item.price.id === priceId)?.formattedTotals.subtotal;
    if (!amount) throw new Error('Pricing unavailable');
    return amount;
}

export async function previewRefillPrice(priceId: string, quantity: number): Promise<string> {
    const paddle = await loadPaddle(() => {});
    if (!paddle) throw new Error('Pricing unavailable');
    const response = await paddle.PricePreview({ items: [{ priceId, quantity }] });
    const amount = response.data.details.lineItems.find(item => item.price.id === priceId)?.formattedTotals.total;
    if (!amount) throw new Error('Pricing unavailable');
    return amount;
}
