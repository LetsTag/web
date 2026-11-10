import { useState } from 'react';
import { loadPaddle } from '../../lib/paddle';
import type { Plan, BillingPeriod } from '../../data/pricing';
import { Text } from '../atoms/Text';
import { Price } from '../atoms/Price';
import { Badge } from '../atoms/Badge';
import styles from './PlanCard.module.css';
export function PlanCard({ plan, period }: { plan: Plan; period: BillingPeriod }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const priceId = __PADDLE_PRICES__[`${plan.id}_${period}`.toUpperCase()];
    const available = /^pri_[a-z0-9]{26}$/.test(priceId || '');
    async function purchase() {
        if (!available || loading) return;
        setLoading(true);
        setError('');
        try {
            const paddle = await loadPaddle(() => {});
            if (!paddle) throw new Error('Paddle unavailable');
            paddle.Checkout.open({ items: [{ priceId, quantity: 1 }] });
        } catch {
            setError('Checkout could not be opened. Please try again.');
        } finally {
            setLoading(false);
        }
    }
    return <article className={`${styles.card} ${plan.id === 'plus' ? styles.featured : ''}`} aria-label={`${plan.name} plan`}>
        <div className={styles.title}><Text as="h2" variant="subheading">{plan.name}</Text>{plan.id === 'plus' && <Badge>Room to grow</Badge>}</div>
        <div className={styles.audience}><Text variant="muted">{plan.audience}</Text></div>
        <div className={styles.cost} aria-live="polite" aria-atomic="true">
            <Price amount={period === 'monthly' ? plan.monthly : plan.annual} period={period} />
            <Text variant="muted">{plan.id === 'free' ? 'Free to explore.' : period === 'monthly' ? `$${plan.annual} billed annually` : 'Billed annually'}</Text>
        </div>
        <div className={styles.allowance}>
            <span className={styles.calls}>{plan.calls}<span className={styles.unit}> calls / month</span></span>
            <Badge tone="neutral">{plan.cap}</Badge>
        </div>
        <Text variant="muted">{plan.summary}</Text>
        <button className={styles.purchase} type="button" disabled={!available || loading} onClick={purchase}>
            {loading ? 'Opening checkout…' : available ? `Choose ${plan.name}` : 'Coming soon'}
        </button>
        {error && <div role="alert"><Text variant="muted">{error}</Text></div>}
    </article>;
}
