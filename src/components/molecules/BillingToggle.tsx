import type { BillingPeriod } from '../../data/pricing';
import { Badge } from '../atoms/Badge';
import styles from './BillingToggle.module.css';
export function BillingToggle({ value, onChange }: { value: BillingPeriod; onChange: (period: BillingPeriod) => void }) {
    return <div className={styles.group} role="group" aria-label="Billing period">
        <button className={styles.button} type="button" aria-pressed={value === 'monthly'} onClick={() => onChange('monthly')}>Monthly</button>
        <button className={styles.button} type="button" aria-pressed={value === 'annual'} onClick={() => onChange('annual')}>Annually <Badge>Save 20%</Badge></button>
    </div>;
}
