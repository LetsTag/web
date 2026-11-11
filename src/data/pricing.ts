export type BillingPeriod = 'monthly' | 'annual';
export type PlanId = 'free' | 'lite' | 'plus' | 'max';
export type FeatureValue = string | false;
export interface Plan {
    id: PlanId;
    name: string;
    audience: string;
    calls: string;
    cap: string;
    summary: string;
}
export const plans: readonly Plan[] = [
    { id: 'free', name: 'Free', audience: 'Hackathon devs & evaluation', calls: '500', cap: 'Hard cap', summary: 'Explore the essentials.' },
    { id: 'lite', name: 'Lite', audience: 'Indie apps & solo developers', calls: '10,000', cap: 'Hard cap', summary: 'Bring your first app to life.' },
    { id: 'plus', name: 'Plus', audience: 'Growing apps & platforms', calls: '100,000', cap: 'Soft cap', summary: 'More detail. More possibilities.' },
    { id: 'max', name: 'Max', audience: 'High-traffic & enterprise apps', calls: '500,000', cap: 'Soft cap', summary: 'Built for your next big chapter.' },
];
export interface Feature {
    name: string;
    upcoming?: boolean;
    values: readonly [FeatureValue, FeatureValue, FeatureValue, FeatureValue];
}
export const features: readonly Feature[] = [
    { name: 'Target audience', values: plans.map(plan => plan.audience) as [string, string, string, string] },
    { name: 'Monthly price', values: ['Unavailable', 'Unavailable', 'Unavailable', 'Unavailable'] },
    { name: 'Annual price', values: ['Unavailable', 'Unavailable', 'Unavailable', 'Unavailable'] },
    { name: 'Monthly call limit', values: ['500 calls (Hard Cap)', '10,000 calls (Hard Cap)', '100,000 calls (Soft Cap)', '500,000 calls (Soft Cap)'] },
    { name: 'Male images', values: ['Watermarked', 'Clean (High-Res)', 'Clean (High-Res)', 'Clean (High-Res)'] },
    { name: 'Female images', values: [false, false, 'Clean (High-Res)', 'Clean (High-Res)'] },
    { name: 'Equipment images', values: ['Watermarked', false, 'Clean (High-Res)', 'Clean (High-Res)'] },
    { name: 'Male videos', upcoming: true, values: [false, false, false, 'Included'] },
    { name: 'Female videos', upcoming: true, values: [false, false, false, 'Included'] },
    { name: 'Languages', values: ['English only', 'English, Spanish, German', 'All 30 Languages', 'All 30 Languages'] },
    { name: 'Metadata depth', values: ['Basic descriptions', 'Names, desc, modalities', 'Full metadata (MET, recovery)', 'Full metadata'] },
    { name: 'Muscle mapping', values: ['Primary muscles only', 'Primary + Secondary', 'Full visual muscle maps', 'Full visual muscle maps'] },
    { name: 'Overage billing', values: ['Blocked (429 Error)', 'Blocked (Requires upgrade)', '$1.50 per 1,000 calls', '$1.00 per 1,000 calls'] },
];
