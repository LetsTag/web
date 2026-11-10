import type { ReactNode } from 'react';
import styles from './Text.module.css';
type Props = { children: ReactNode; as?: 'p' | 'h1' | 'h2' | 'h3' | 'span'; variant?: 'body' | 'muted' | 'eyebrow' | 'hero' | 'heading' | 'subheading'; align?: 'left' | 'center'; id?: string };
export function Text({ children, as: Tag = 'p', variant = 'body', align = 'left', id }: Props) {
    return <Tag id={id} className={`${styles.text} ${styles[variant]} ${styles[align]}`}>{children}</Tag>;
}
