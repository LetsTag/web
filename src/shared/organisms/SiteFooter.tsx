import styles from './SiteFooter.module.css';
export function SiteFooter() {
    return <footer className={styles.footer}>
        <div className={styles.inner}>
            <div>
                <strong>Let’s Tag</strong>
                <p>Exercise data. Built for what’s next.</p>
                <small>© {new Date().getFullYear()} Martspec LLC</small>
            </div>
            <nav aria-label="Footer">
                <a href="/pricing/">Pricing</a>
                <a href="/terms/">Terms of Service</a>
                <a href="/refunds/">Refund Policy</a>
                <a href="/privacy/">Privacy Policy</a>
            </nav>
        </div>
    </footer>;
}
