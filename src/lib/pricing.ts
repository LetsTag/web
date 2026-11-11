import type { BillingPeriod, PlanId } from '../data/pricing';
import { loadPaddle } from './paddle';

declare const __AUTH_API_BASE_URL__: string;
export type PriceKey = `${PlanId}_${BillingPeriod}`;
export type Catalog = Partial<Record<PriceKey, string>>;
export type LocalizedPrices = Partial<Record<PriceKey, string>>;
export async function getCatalog(): Promise<Catalog> {
    const response = await fetch(`${__AUTH_API_BASE_URL__}/v1/pricing/catalog`);
    if (!response.ok) throw new Error('Pricing unavailable');
    const data = await response.json() as { prices: Catalog };
    if (!data.prices || typeof data.prices !== 'object') throw new Error('Invalid pricing');
    return data.prices;
}
export async function previewPrices(catalog: Catalog): Promise<LocalizedPrices> {
    const entries = Object.entries(catalog).filter(([, id]) => /^pri_[a-z0-9]{26}$/.test(id));
    if (!entries.length) throw new Error('Pricing unavailable');
    const paddle = await loadPaddle(() => {});
    if (!paddle) throw new Error('Pricing unavailable');
    const result = await paddle.PricePreview({ items: entries.map(([, priceId]) => ({ priceId, quantity: 1 })) });
    const prices: LocalizedPrices = {};
    for (const [key, id] of entries) {
        const item = result.data.details.lineItems.find(line => line.price.id === id);
        if (item?.formattedTotals.subtotal) prices[key as PriceKey] = item.formattedTotals.subtotal;
    }
    return prices;
}
