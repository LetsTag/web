import type { BillingPeriod } from '../../data/pricing';
import styles from './Price.module.css';
export function Price({ amount, period }: { amount: number; period: BillingPeriod }) {
    return <div className={styles.price} aria-label={`$${amount} per ${period === 'monthly' ? 'month' : 'year'}`}>
        <span className={styles.amount}>${amount}</span>
        <span className={styles.period}>/ {period === 'monthly' ? 'mo' : 'year'}</span>
    </div>;
}
