import { Text } from '../atoms/Text';
import styles from './SiteFooter.module.css';
export function SiteFooter() {
    return <footer className={styles.footer}><Text variant="muted">© {new Date().getFullYear()} Let’s Tag LLC</Text><Text variant="muted">Exercise data. Built for what’s next.</Text></footer>;
}
