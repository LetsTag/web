import styles from './SiteFooter.module.css';
export function SiteFooter() {
    return <footer className={styles.footer}><div className={styles.inner}><div><strong>Let’s Tag</strong><p>Exercise data. Built for what’s next.</p><small>© {new Date().getFullYear()} Let’s Tag LLC</small></div><nav aria-label="Legal"><a href="/terms/">Terms of Service</a><a href="/privacy/">Privacy Policy</a></nav></div></footer>;
}
