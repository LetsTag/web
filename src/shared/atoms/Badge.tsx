import type { ReactNode } from 'react';
import styles from './Badge.module.css';
export function Badge({ children, tone = 'green' }: { children: ReactNode; tone?: 'green' | 'neutral' }) {
    return <span className={`${styles.badge} ${styles[tone]}`}>{children}</span>;
}
