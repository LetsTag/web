import { useEffect, useState } from 'react';
import { pendingCheckout, openCheckout } from '../../lib/checkout';
import { getCatalog, previewPrices, type Catalog, type LocalizedPrices } from '../../lib/pricing';
import { getUser, type User } from '../../lib/auth';
import { features, plans, type BillingPeriod } from '../../data/pricing';
import { Text } from '../atoms/Text';
import { BillingToggle } from '../molecules/BillingToggle';
import { PlanCard } from '../molecules/PlanCard';
import { FeatureRow } from '../molecules/FeatureRow';
import styles from './Pricing.module.css';
export function Pricing() {
    const [period, setPeriod] = useState<BillingPeriod>(() => pendingCheckout()?.period === 'annual' ? 'annual' : 'monthly');
    const [checkoutError, setCheckoutError] = useState('');
    const [catalog, setCatalog] = useState<Catalog>({});
    const [prices, setPrices] = useState<LocalizedPrices>({});
    const [pricingError, setPricingError] = useState('');
    useEffect(() => {
        let active = true;
        (async () => {
            try { const next = await getCatalog(); const preview = await previewPrices(next); if (active) { setCatalog(next); setPrices(preview); } }
            catch { if (active) setPricingError('Pricing is temporarily unavailable. Please try again later.'); }
        })();
        return () => { active = false; };
    }, []);
    const [user, setUser] = useState<User | null>(null);
    const [checkingSession, setCheckingSession] = useState(true);
    useEffect(() => {
        let active = true;
        let generation = 0;
        const refresh = () => {
            const current = ++generation;
            getUser().then(value => { if (active && current === generation) setUser(value); })
                .catch(() => { if (active && current === generation) setUser(null); })
                .finally(() => { if (active && current === generation) setCheckingSession(false); });
        };
        refresh();
        window.addEventListener('signed-in', refresh);
        window.addEventListener('signed-out', refresh);
        window.addEventListener('session-expired', refresh);
        window.addEventListener('storage', refresh);
        return () => { active = false; window.removeEventListener('signed-in', refresh); window.removeEventListener('signed-out', refresh); window.removeEventListener('session-expired', refresh); window.removeEventListener('storage', refresh); };
    }, []);
    useEffect(() => {
        const resume = async () => {
            const selection = pendingCheckout();
            if (!selection) return;
            setPeriod(selection.period);
            try { const user = await getUser(); await openCheckout(selection, user?.email); } catch { setCheckoutError('Checkout could not be opened. Please choose your plan again.'); }
        };
        window.addEventListener('signed-in', resume);
        return () => window.removeEventListener('signed-in', resume);
    }, []);
    return <>
        <section className={styles.intro} aria-labelledby="pricing-title">
            <Text variant="eyebrow" align="center">The exercise API, at your pace</Text>
            <Text as="h1" variant="hero" align="center" id="pricing-title">Big ideas.<br />Straightforward pricing.</Text>
            <div className={styles.description}><Text align="center">From your first prototype to your next million users.<br />Choose the exercise data your app needs, with room to grow.</Text></div>
            <div className={styles.toggle}><BillingToggle value={period} onChange={setPeriod} /></div>
        </section>
        {(checkoutError || pricingError) && <p role="alert">{checkoutError || pricingError}</p>}
        <section className={styles.cards} aria-label="Pricing plans">
            {plans.map(plan => <PlanCard plan={plan} period={period} user={user} checkingSession={checkingSession} catalog={catalog} prices={prices} key={plan.id} />)}
        </section>
        <section className={styles.comparison} aria-labelledby="comparison-title">
            <div className={styles.comparisonHeading}><div className={styles.headingText}>
                <Text as="h2" variant="heading" id="comparison-title">Every detail, side by side.</Text>
                <Text variant="muted">Know exactly what’s included in your plan.</Text>
            </div><Text variant="muted">Localized prices before tax</Text></div>
            <div className={styles.tableScroll} role="region" aria-label="Plan feature comparison; scroll horizontally on smaller screens" tabIndex={0}>
                <table className={styles.table}>
                    <caption className={styles.caption}>Compare all Free, Lite, Plus, and Max features</caption>
                    <thead><tr><th scope="col" className={styles.featureHeading}>Features</th>{plans.map(plan => <th scope="col" className={`${styles.columnHeading} ${plan.id === 'plus' ? styles.featured : ''}`} key={plan.id}>{plan.name}</th>)}</tr></thead>
                    <tbody>{features.map(feature => {
                        const interval = feature.name === 'Monthly price' ? 'monthly' : feature.name === 'Annual price' ? 'annual' : null;
                        const localized = interval ? { ...feature, values: plans.map(plan => prices[`${plan.id}_${interval}`] ? `${prices[`${plan.id}_${interval}`]} / ${interval === 'monthly' ? 'mo' : 'year'}` : 'Unavailable') as [string, string, string, string] } : feature;
                        return <FeatureRow feature={localized} key={feature.name} />;
                    })}</tbody>
                </table>
            </div>
            <div className={styles.notes}>
                <Text variant="muted">Annual plans are billed once a year. Monthly call limits apply to both billing periods.</Text>
                <Text variant="muted">Free and Lite stop at their monthly limit. Plus and Max can continue with the overage rates shown above. Videos are upcoming.</Text>
            </div>
        </section>
    </>;
}
