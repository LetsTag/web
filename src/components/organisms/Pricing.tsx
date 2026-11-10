import { useState } from 'react';
import { features, plans, type BillingPeriod } from '../../data/pricing';
import { Text } from '../atoms/Text';
import { BillingToggle } from '../molecules/BillingToggle';
import { PlanCard } from '../molecules/PlanCard';
import { FeatureRow } from '../molecules/FeatureRow';
import styles from './Pricing.module.css';
export function Pricing() {
    const [period, setPeriod] = useState<BillingPeriod>('monthly');
    return <>
        <section className={styles.intro} aria-labelledby="pricing-title">
            <Text variant="eyebrow" align="center">The exercise API, at your pace</Text>
            <Text as="h1" variant="hero" align="center" id="pricing-title">Big ideas.<br />Straightforward pricing.</Text>
            <div className={styles.description}><Text align="center">From your first prototype to your next million users.<br />Choose the exercise data your app needs, with room to grow.</Text></div>
            <div className={styles.toggle}><BillingToggle value={period} onChange={setPeriod} /></div>
        </section>
        <section className={styles.cards} aria-label="Pricing plans">
            {plans.map(plan => <PlanCard plan={plan} period={period} key={plan.id} />)}
        </section>
        <section className={styles.comparison} aria-labelledby="comparison-title">
            <div className={styles.comparisonHeading}><div className={styles.headingText}>
                <Text as="h2" variant="heading" id="comparison-title">Every detail, side by side.</Text>
                <Text variant="muted">Know exactly what’s included in your plan.</Text>
            </div><Text variant="muted">All prices in USD</Text></div>
            <div className={styles.tableScroll} role="region" aria-label="Plan feature comparison; scroll horizontally on smaller screens" tabIndex={0}>
                <table className={styles.table}>
                    <caption className={styles.caption}>Compare all Free, Lite, Plus, and Max features</caption>
                    <thead><tr><th scope="col" className={styles.featureHeading}>Features</th>{plans.map(plan => <th scope="col" className={`${styles.columnHeading} ${plan.id === 'plus' ? styles.featured : ''}`} key={plan.id}>{plan.name}</th>)}</tr></thead>
                    <tbody>{features.map(feature => <FeatureRow feature={feature} key={feature.name} />)}</tbody>
                </table>
            </div>
            <div className={styles.notes}>
                <Text variant="muted">Annual plans are billed once a year. Monthly call limits apply to both billing periods.</Text>
                <Text variant="muted">Free and Lite stop at their monthly limit. Plus and Max can continue with the overage rates shown above. Videos are upcoming.</Text>
            </div>
        </section>
    </>;
}
