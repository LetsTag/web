import { formatUpdateDate, roadmap } from '../lib/productUpdates';
import { SiteLayout } from '../shared/templates/SiteLayout';
import styles from './updates.module.css';

export default function RoadmapPage() {
    return <SiteLayout>
        <div className={styles.updates}>
            <header className={styles.intro}>
                <h1>Product <em>roadmap.</em></h1>
                <p>Explore what we are planning and researching. Dates are tentative and features are not yet available.</p>
                <p>The current API does not accept individual measurements.</p>
            </header>
            <ol className={styles.releaseList}>
                {roadmap.map(item => <li key={item.date} className={styles.release}>
                    <time dateTime={item.date}>Planned {formatUpdateDate(item.date)}</time>
                    <article className={styles.releaseCard}>
                        <div><h3>{item.title}</h3><p>{item.description}</p></div>
                    </article>
                </li>)}
            </ol>
        </div>
    </SiteLayout>;
}
