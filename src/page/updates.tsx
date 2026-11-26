import { formatUpdateDate, releasedUpdates } from '../lib/productUpdates';
import { SiteLayout } from '../shared/templates/SiteLayout';
import styles from './updates.module.css';

export default function UpdatesPage() {
    return <SiteLayout>
        <div className={styles.updates}>
            <header className={styles.intro}>
                <h1>Product <em>updates.</em></h1>
                <p>Follow what’s new in the LetsTag API, from exercises and equipment to the data that helps your app do more.</p>
            </header>

            <section className={styles.releases} aria-labelledby="released-updates">
                <h2 id="released-updates">What’s shipped</h2>
                <ol className={styles.releaseList}>
                    {releasedUpdates.map(update => <li key={update.date} className={styles.release}>
                        <time dateTime={update.date}>{formatUpdateDate(update.date)}</time>
                        <article className={styles.releaseCard}>
                            <div>
                                <h3>{update.title}</h3>
                                <p>{update.description}</p>
                            </div>
                            {update.image && <div className={`${styles.preview}${update.image.anatomy ? ` ${styles.anatomy}` : ''}`}>
                                <img src={update.image.src} alt={update.image.alt} loading="lazy" />
                            </div>}
                        </article>
                    </li>)}
                </ol>
            </section>
        </div>
    </SiteLayout>;
}
