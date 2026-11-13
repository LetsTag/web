import styles from './Brand.module.css';
export function Brand() {
    return <a className={styles.brand} href="/" aria-label="Let's Tag home">
        <img className={styles.logo} src="/img/logo_256.webp" width="40" height="40" alt="" />
        <span className={styles.name}>let’s tag<span className={styles.dot}>.</span></span>
    </a>;
}
