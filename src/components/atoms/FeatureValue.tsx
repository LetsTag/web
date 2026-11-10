import type { FeatureValue as Value } from '../../data/pricing';
import styles from './FeatureValue.module.css';
export function FeatureValue({ value }: { value: Value }) {
    return value === false
        ? <span className={styles.unavailable} aria-label="Not included"><span aria-hidden="true">—</span></span>
        : <span className={styles.value}>{value}</span>;
}
