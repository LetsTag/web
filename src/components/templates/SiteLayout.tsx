import type { ReactNode } from 'react';
import { SiteHeader } from '../organisms/SiteHeader';
import { SiteFooter } from '../organisms/SiteFooter';
import styles from './SiteLayout.module.css';
export function SiteLayout({ children, compact = false }: { children: ReactNode; compact?: boolean }) {
    return <div className={styles.page}><div className={styles.container}><SiteHeader /><main className={compact ? styles.compact : styles.main}>{children}</main><SiteFooter /></div></div>;
}
