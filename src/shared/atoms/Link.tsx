import type { ReactNode } from 'react';
import styles from './Link.module.css';
export function Link({ href, children }: { href: string; children: ReactNode }) {
    return <a className={styles.link} href={href}>{children}</a>;
}
