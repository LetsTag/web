import type { Feature } from '../../data/pricing';
import { FeatureValue } from '../atoms/FeatureValue';
import { Badge } from '../atoms/Badge';
import styles from './FeatureRow.module.css';
export function FeatureRow({ feature }: { feature: Feature }) {
    return <tr>
        <th scope="row" className={styles.label}><span className={styles.name}>{feature.name}</span>{feature.upcoming && <Badge tone="neutral">Upcoming</Badge>}</th>
        {feature.values.map((value, index) => <td className={`${styles.cell} ${index === 2 ? styles.featured : ''}`} key={index}><FeatureValue value={value} /></td>)}
    </tr>;
}
