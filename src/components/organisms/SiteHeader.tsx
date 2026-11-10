import { Brand } from '../atoms/Brand';
import { Text } from '../atoms/Text';
import styles from './SiteHeader.module.css';
export function SiteHeader() {
    return <header className={styles.header}><Brand /><Text variant="eyebrow">Exercise API</Text></header>;
}
